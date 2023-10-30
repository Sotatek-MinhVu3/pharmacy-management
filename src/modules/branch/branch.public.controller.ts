import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { BranchService } from './branch.service';

@Controller('public-branch')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicBranchController {
  constructor(private branchService: BranchService) {}

  @Get()
  async getAllBranches() {
    return await this.branchService.getAllBranches();
  }

  @Get('/:id')
  async getBranchById(@Param('id') id: number) {
    return await this.branchService.getBranchById(id);
  }
}
