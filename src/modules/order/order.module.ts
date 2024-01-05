import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { DrugModule } from '../drug/drug.module';
import { BranchModule } from '../branch/branch.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [SharedModule, DrugModule, BranchModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
