import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../shared/dtos/product/request.dto';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';

@Controller('product')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createProduct(@Body() reqBody: CreateProductDto) {
    return await this.productService.create(reqBody);
  }

  @Get('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getById(@Param('id') id: number) {
    return await this.productService.getProductById(id, true);
  }

  @Get('/category/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getAllByCategory(@Param('id') id: number) {
    return await this.productService.getAllByCategory(id, true);
  }

  @Get('/product-type/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getAllByProductType(@Param('id') id: number) {
    return await this.productService.getAllByProductType(id, true);
  }

  @Get()
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getAll() {
    return await this.productService.getAll(true);
  }

  @Put('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateProduct(
    @Param('id') id: number,
    @Body() reqBody: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, reqBody);
  }

  @Delete('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.deleteProduct(id);
  }
}
