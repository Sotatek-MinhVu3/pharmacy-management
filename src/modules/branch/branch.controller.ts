import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import {
  CreateBranchDto,
  UpdateBranchDto,
} from '../shared/dtos/branch/request.dto';

@Controller('branch')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class BranchController {
  constructor(private branchService: BranchService) {}

  @Post('/create')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createBranch(@Body() reqBody: CreateBranchDto) {
    return await this.branchService.create(reqBody);
  }

  @Get()
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAllBranches() {
    return await this.branchService.getAllBranches();
  }

  @Get('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getBranchById(@Param('id') id: number) {
    return await this.branchService.getBranchById(id);
  }

  @Put('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateBranch(
    @Param('id') id: number,
    @Body() reqBody: UpdateBranchDto,
  ) {
    return await this.branchService.updateBranch(id, reqBody);
  }

  @Delete('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async deleteBranch(@Param('id') id: number) {
    return await this.branchService.deleteBranch(id);
  }
}
