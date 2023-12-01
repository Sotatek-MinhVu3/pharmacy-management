import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import { CategoryService } from './category.service';
import { DrugTypeService } from './drug-type/drug-type.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../shared/dtos/category/request.dto';
import {
  CreateDrugTypeDto,
  UpdateDrugTypeDto,
} from '../shared/dtos/drug-type/request.dto';
import * as categories from './../../database/seeders/categories.json';
import * as drugTypes from './../../database/seeders/drug-types.json';

@Controller('categories')
@UseGuards(CustomAuthGuard)
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private drugTypeService: DrugTypeService,
  ) {}

  @Post('/seed')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async seedCategories() {
    for (let category of categories.entries()) {
      await this.categoryService.create(category[1]);
    }
  }

  @Post('/create')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createCategory(@Body() reqBody: CreateCategoryDto) {
    await this.categoryService.create(reqBody);
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: number) {
    return await this.categoryService.getCategoryById(id);
  }

  @Put('/:id/')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateCategory(
    @Param('id') id: number,
    @Body() reqBody: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, reqBody);
  }

  @Get('/:categoryId/drug-types')
  async getAllDrugTypesOfCategory(@Param('categoryId') categoryId: number) {
    return await this.drugTypeService.getAllByCategoryId(categoryId);
  }

  @Get('/drug-types/:id')
  async getDrugTypeById(@Param('id') id: number) {
    return await this.drugTypeService.getDrugTypeById(id);
  }

  @Post('/drug-types/seed')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async seedDrugTypes() {
    for (let drugType of drugTypes.entries()) {
      await this.drugTypeService.create(drugType[1]);
    }
  }

  @Post('/drug-types/create')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createDrugType(@Body() reqBody: CreateDrugTypeDto) {
    return await this.drugTypeService.create(reqBody);
  }

  @Put('/:categoryId/drug-types/:typeId')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateProductType(
    @Param('categoryId') categoryId: number,
    @Param('typeId') typeId: number,
    @Body() reqBody: UpdateDrugTypeDto,
  ) {
    return await this.drugTypeService.updateDrugType(
      categoryId,
      typeId,
      reqBody,
    );
  }
}
