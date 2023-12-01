import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../shared/dtos/category/request.dto';
import { CategoryEntity } from 'src/database/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(reqBody: CreateCategoryDto) {
    const newCategory = this.categoryRepo.create(reqBody);
    await this.categoryRepo.save(newCategory);
    return {
      message: 'Category has been created successfully!',
    };
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return category;
  }

  async updateCategory(id: number, reqBody: UpdateCategoryDto) {
    let category = await this.getCategoryById(id);
    category = { ...category, ...reqBody };
    await this.categoryRepo.save(category);
    return {
      message: 'Updated category!',
    };
  }
}
