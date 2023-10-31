import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/database/entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../shared/dtos/product/request.dto';
import { ProductTypeService } from '../category/product-type/product-type.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly productTypeService: ProductTypeService,
  ) {}

  async create(reqBody: CreateProductDto) {
    const existedProduct = await this.productRepo.findOneBy({
      barcode: reqBody.barcode,
    });
    if (existedProduct) {
      throw new BadRequestException('Product existed!');
    }
    const product = {
      name: reqBody.name,
      dueDate: reqBody.dueDate,
      typeId: reqBody.typeId,
      supplierId: reqBody.supplierId,
      soldAsDose: reqBody.soldAsDose,
      sensitiveIngredients: reqBody.sensitiveIngredients
        ? JSON.stringify(reqBody.sensitiveIngredients)
        : null,
      description: reqBody.description,
      unit: reqBody.unit,
      barcode: reqBody.barcode,
      size: reqBody.size,
    };
    const newProduct = this.productRepo.create(product);
    await this.productRepo.save(newProduct);
    return {
      message: 'Created product!',
    };
  }

  async getAll(isManager: boolean) {
    if (isManager) {
      return await this.productRepo.find();
    } else {
      return await this.productRepo.find({ where: { soldAsDose: false } });
    }
  }

  async getAllByCategory(categoryId: number, isManager: boolean) {
    const productTypes =
      await this.productTypeService.getAllByCategoryId(categoryId);
    let products = [];
    for (let productType of productTypes) {
      const productsByType = await this.getAllByProductType(
        productType.id,
        isManager,
      );
      products.push(productsByType);
    }
    return products.flat();
  }

  async getAllByProductType(typeId: number, isManager: boolean) {
    let products: Product[];
    if (isManager) {
      products = await this.productRepo.find({
        where: { typeId },
      });
    } else {
      products = await this.productRepo.find({
        where: { typeId, soldAsDose: false },
      });
    }
    if (!products.length) {
      return [];
    } else return products;
  }

  async getProductById(id: number, isManager: boolean) {
    let product: Product;
    if (isManager) {
      product = await this.productRepo.findOneBy({ id });
    } else {
      product = await this.productRepo.findOneBy({ id, soldAsDose: false });
    }
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return product;
  }

  async getProductByBarcode(barcode: number) {
    const product = await this.productRepo.findOneBy({ barcode });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return product;
  }

  async updateProduct(id: number, reqBody: UpdateProductDto) {
    let product = await this.getProductById(id, true);
    const sensitiveIngredients = reqBody.sensitiveIngredients
      ? JSON.stringify(reqBody.sensitiveIngredients)
      : null;
    product = { ...product, ...reqBody, sensitiveIngredients };
    await this.productRepo.save(product);
    return {
      message: 'Updated product!',
    };
  }

  async deleteProduct(id: number) {
    let product = await this.getProductById(id, true);
    await this.productRepo.softDelete(id);
    return {
      message: 'Deleted product!',
    };
  }
}
