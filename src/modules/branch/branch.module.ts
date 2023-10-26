import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { SharedModule } from '../shared/shared.module';
import { BranchService } from './branch.service';

@Module({
  imports: [SharedModule],
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
