import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrugEntity } from 'src/database/entities/product.entity';
import { CreateDrugDto, UpdateDrugDto } from '../shared/dtos/drug/request.dto';
import { ProductTypeService } from '../category/product-type/product-type.service';

@Injectable()
export class DrugService {
  constructor(
    @InjectRepository(DrugEntity)
    private readonly drugRepo: Repository<DrugEntity>,
    private readonly drugTypeService: ProductTypeService,
  ) {}

  async create(reqBody: CreateDrugDto) {
    const existedProduct = await this.drugRepo.findOneBy({
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
      price: reqBody.price,
    };
    const newProduct = this.drugRepo.create(product);
    await this.drugRepo.save(newProduct);
    return {
      message: 'Created product!',
    };
  }

  async getAll(isManager: boolean) {
    if (isManager) {
      return await this.drugRepo.find();
    } else {
      return await this.drugRepo.find({ where: { soldAsDose: false } });
    }
  }

  async getAllByCategory(categoryId: number, isManager: boolean) {
    const productTypes =
      await this.drugTypeService.getAllByCategoryId(categoryId);
    let products = [];
    for (let productType of productTypes) {
      const productsByType = await this.getAllByDrugType(
        productType.id,
        isManager,
      );
      products.push(productsByType);
    }
    return products.flat();
  }

  async getAllByDrugType(typeId: number, isManager: boolean) {
    let drugs: DrugEntity[];
    if (isManager) {
      drugs = await this.drugRepo.find({
        where: { typeId },
      });
    } else {
      drugs = await this.drugRepo.find({
        where: { typeId, soldAsDose: false },
      });
    }
    if (!drugs.length) {
      return [];
    } else return drugs;
  }

  async getDrugById(id: number, isManager: boolean) {
    let drug: DrugEntity;
    if (isManager) {
      drug = await this.drugRepo.findOneBy({ id });
    } else {
      drug = await this.drugRepo.findOneBy({ id, soldAsDose: false });
    }
    if (!drug) {
      throw new NotFoundException('Drug not found!');
    }
    return drug;
  }

  async getDrugByBarcode(barcode: number) {
    const product = await this.drugRepo.findOneBy({ barcode });
    if (!product) {
      throw new NotFoundException('Drug not found!');
    }
    return product;
  }

  async updateProduct(id: number, reqBody: UpdateDrugDto) {
    let product = await this.getDrugById(id, true);
    const sensitiveIngredients = reqBody.sensitiveIngredients
      ? JSON.stringify(reqBody.sensitiveIngredients)
      : null;
    product = { ...product, ...reqBody, sensitiveIngredients };
    await this.drugRepo.save(product);
    return {
      message: 'Updated product!',
    };
  }

  async deleteProduct(id: number) {
    let product = await this.getDrugById(id, true);
    await this.drugRepo.softDelete(id);
    return {
      message: 'Deleted product!',
    };
  }
}
