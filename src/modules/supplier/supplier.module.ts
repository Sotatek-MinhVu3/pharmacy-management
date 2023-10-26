import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SharedModule } from '../shared/shared.module';
import { SupplierService } from './supplier.service';

@Module({
  imports: [SharedModule],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
