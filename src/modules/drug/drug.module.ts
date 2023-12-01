import { Module } from '@nestjs/common';
import { DrugController } from './drug.controller';
import { SharedModule } from '../shared/shared.module';
import { DrugService } from './drug.service';
import { PublicProductController } from './product.public.controller';
import { ProductTypeService } from '../category/product-type/product-type.service';

@Module({
  imports: [SharedModule],
  providers: [DrugService, ProductTypeService],
  controllers: [DrugController, PublicProductController],
})
export class DrugModule {}
