import { Module } from '@nestjs/common';
import { RackController } from './rack.controller';
import { SharedModule } from '../shared/shared.module';
import { RackService } from './rack.service';
import { DrugModule } from '../drug/drug.module';
import { BranchModule } from '../branch/branch.module';

@Module({
  imports: [SharedModule, DrugModule, BranchModule],
  providers: [RackService],
  controllers: [RackController],
})
export class RackModule {}
