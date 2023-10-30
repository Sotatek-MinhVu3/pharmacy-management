import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { SharedModule } from '../shared/shared.module';
import { BranchService } from './branch.service';
import { PublicBranchController } from './branch.public.controller';

@Module({
  imports: [SharedModule],
  providers: [BranchService],
  controllers: [BranchController, PublicBranchController],
})
export class BranchModule {}
