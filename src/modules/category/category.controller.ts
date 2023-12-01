import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import { CategoryService } from './category.service';
import { DrugTypeService } from './drug-type/drug-type.service';
import { UpdateCategoryDto } from '../shared/dtos/category/request.dto';
import { UpdateProductTypeDto } from '../shared/dtos/product-type/request.dto';

@Controller('categories')
@UseGuards(CustomAuthGuard)
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private productTypeService: DrugTypeService,
  ) {}

  @Put('/:id/')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateCategory(
    @Param('id') id: number,
    @Body() reqBody: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, reqBody);
  }

  @Get('/:categoryId/product-types')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAllProductTypesOfCategory(@Param('categoryId') categoryId: number) {
    return await this.productTypeService.getAllByCategoryId(categoryId);
  }

  @Put('/:categoryId/product-types/:typeId')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateProductType(
    @Param('categoryId') categoryId: number,
    @Param('typeId') typeId: number,
    @Body() reqBody: UpdateProductTypeDto,
  ) {
    return await this.productTypeService.updateProductType(
      categoryId,
      typeId,
      reqBody,
    );
  }
}
