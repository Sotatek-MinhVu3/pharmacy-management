import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product-public')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicProductController {
  constructor(private productService: ProductService) {}

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.productService.getProductById(id, false);
  }

  @Get('/category/:id')
  async getAllByCategory(@Param('id') id: number) {
    return await this.productService.getAllByCategory(id, false);
  }

  @Get('/product-type/:id')
  async getAllByProductType(@Param('id') id: number) {
    return await this.productService.getAllByProductType(id, false);
  }

  @Get()
  async getAll() {
    return await this.productService.getAll(false);
  }
}
