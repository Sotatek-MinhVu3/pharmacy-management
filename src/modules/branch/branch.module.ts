import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { SharedModule } from '../shared/shared.module';
import { BranchService } from './branch.service';

@Module({
  imports: [SharedModule],
  providers: [BranchService],
  controllers: [BranchController],
  exports: [BranchService],
})
export class BranchModule {}
