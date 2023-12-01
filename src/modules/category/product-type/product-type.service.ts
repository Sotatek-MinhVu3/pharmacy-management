import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrugTypeEntity } from 'src/database/entities/drug-type.entity';
import {
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from 'src/modules/shared/dtos/product-type/request.dto';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(DrugTypeEntity)
    private readonly productTypeRepo: Repository<DrugTypeEntity>,
  ) {}

  async create(reqBody: CreateProductTypeDto) {
    const newProductType = this.productTypeRepo.create(reqBody);
    await this.productTypeRepo.save(newProductType);
    return {
      message: 'Product type has been created successfully!',
    };
  }

  async getAllByCategoryId(categoryId: number) {
    const types = await this.productTypeRepo.findBy({ categoryId });
    if (!types.length) {
      throw new NotFoundException('Category not found!');
    }
    return types;
  }

  async updateProductType(
    categoryId: number,
    id: number,
    reqBody: UpdateProductTypeDto,
  ) {
    let productType = await this.productTypeRepo.findOneBy({ categoryId, id });
    productType = { ...productType, ...reqBody };
    await this.productTypeRepo.save(productType);
    return {
      message: 'Updated product type!',
    };
  }
}
