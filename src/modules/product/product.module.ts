import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { SharedModule } from '../shared/shared.module';
import { ProductService } from './product.service';
import { PublicProductController } from './product.public.controller';
import { ProductTypeService } from '../category/product-type/product-type.service';

@Module({
  imports: [SharedModule],
  providers: [ProductService, ProductTypeService],
  controllers: [ProductController, PublicProductController],
})
export class ProductModule {}
