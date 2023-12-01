import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { DrugService } from './drug.service';

@Controller('product-public')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicProductController {
  constructor(private productService: DrugService) {}

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.productService.getDrugById(id, false);
  }

  @Get('/category/:id')
  async getAllByCategory(@Param('id') id: number) {
    return await this.productService.getAllByCategory(id, false);
  }

  @Get('/drug-type/:id')
  async getAllByProductType(@Param('id') id: number) {
    return await this.productService.getAllByDrugType(id, false);
  }

  @Get()
  async getAll() {
    return await this.productService.getAll(false);
  }
}
