import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ProductTypeService } from './product-type/product-type.service';

@Module({
  imports: [SharedModule],
  providers: [CategoryService, ProductTypeService],
  controllers: [CategoryController],
})
export class CategoryModule {}
