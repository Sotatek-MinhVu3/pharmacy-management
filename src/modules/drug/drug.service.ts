import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrugEntity } from 'src/database/entities/drug.entity';
import { CreateDrugDto, UpdateDrugDto } from '../shared/dtos/drug/request.dto';
import { DrugTypeService } from '../category/drug-type/drug-type.service';

@Injectable()
export class DrugService {
  constructor(
    @InjectRepository(DrugEntity)
    private readonly drugRepo: Repository<DrugEntity>,
    private readonly drugTypeService: DrugTypeService,
  ) {}

  async create(reqBody: CreateDrugDto) {
    const existedDrug = await this.drugRepo.findOneBy({
      barcode: reqBody.barcode,
    });
    if (existedDrug) {
      throw new BadRequestException('Drug existed!');
    }
    const drug = {
      name: reqBody.name,
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
    const newDrug = this.drugRepo.create(drug);
    await this.drugRepo.save(newDrug);
    return newDrug;
  }

  async getAll() {
    return await this.drugRepo.find();
  }

  async getAllByCategory(categoryId: number, isManager: boolean) {
    const productTypes =
      await this.drugTypeService.getAllByCategoryId(categoryId);
    let products = [];
    for (let productType of productTypes) {
      const productsByType = await this.getAllByDrugType(productType.id);
      products.push(productsByType);
    }
    return products.flat();
  }

  async getAllByDrugType(typeId: number) {
    let drugs: DrugEntity[];
    drugs = await this.drugRepo.find({
      where: { typeId },
    });

    if (!drugs.length) {
      return [];
    } else return drugs;
  }

  async getDrugById(id: number) {
    let drug: DrugEntity;
    drug = await this.drugRepo.findOneBy({ id });

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
    let product = await this.getDrugById(id);
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
    let product = await this.getDrugById(id);
    await this.drugRepo.softDelete(id);
    return {
      message: 'Deleted product!',
    };
  }
}
