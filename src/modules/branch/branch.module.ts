import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '../database/entities/branch.entity';
import { BranchService } from './branch.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Branch])],
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
