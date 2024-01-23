import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { DrugModule } from '../drug/drug.module';
import { BranchModule } from '../branch/branch.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RackModule } from '../rack/rack.module';

@Module({
  imports: [SharedModule, DrugModule, BranchModule, RackModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
