import { Module } from '@nestjs/common';
import { DrugController } from './drug.controller';
import { SharedModule } from '../shared/shared.module';
import { DrugService } from './drug.service';
import { DrugTypeService } from '../category/drug-type/drug-type.service';

@Module({
  imports: [SharedModule],
  providers: [DrugService, DrugTypeService],
  controllers: [DrugController],
  exports: [DrugService],
})
export class DrugModule {}
