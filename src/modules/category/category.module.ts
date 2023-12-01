import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DrugTypeService } from './drug-type/drug-type.service';

@Module({
  imports: [SharedModule],
  providers: [CategoryService, DrugTypeService],
  controllers: [CategoryController],
})
export class CategoryModule {}
