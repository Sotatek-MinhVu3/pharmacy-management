import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RackService } from './rack.service';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import {
  CreateRackRequestDto,
  UpdateRackDrugRequestDto,
} from '../shared/dtos/rack/request.dto';
import { plainToClass } from 'class-transformer';
import { GetUserFromRequestDto } from '../shared/dtos/user/response.dto';

@Controller('rack')
@UseInterceptors(ClassSerializerInterceptor)
export class RackController {
  constructor(private rackService: RackService) {}

  @Post('/total')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async createTotalRack(@Body() reqBody: CreateRackRequestDto) {
    return await this.rackService.createTotalRack(reqBody);
  }

  @Post('/branch-warehouse/:branchId')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async createBranchWarehouse(
    @Param('branchId') branchId: number,
    @Body() reqBody: CreateRackRequestDto,
  ) {
    return await this.rackService.createBranchWarehouse(reqBody, branchId);
  }

  @Post('/branch')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async createBranchRack(
    @Req() req: any,
    @Body() reqBody: CreateRackRequestDto,
  ) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    return await this.rackService.createBranchRack(reqBody, branchId);
  }

  @Get('/total')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async getTotalRacks() {
    return await this.rackService.getTotalRack();
  }

  @Get('/branch')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async getBranchRacks() {
    const branchRacks = await this.rackService.getAllBranchRacks();
    return branchRacks;
  }

  @Get('/branch/:branchId')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async getBranchRacksById(@Param('branchId') branchId: number) {
    const branchRacks = await this.rackService.getRacksByBranchId(branchId);
    return branchRacks;
  }

  @Get('/my-branch')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async getMyBranchRacks(@Req() req: any) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    const branchRacks = await this.rackService.getRacksByBranchId(branchId);
    return branchRacks;
  }

  @Put('/add-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async addDrugsToRack(reqBody: UpdateRackDrugRequestDto) {
    await this.rackService.addDrugsToRack(reqBody);
  }

  @Put('/branch/add-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async addDrugsToBranchRack(
    @Req() req: any,
    reqBody: UpdateRackDrugRequestDto,
  ) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    await this.rackService.addDrugsToBranchRack(reqBody, branchId);
  }

  @Put('/remove-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async removeDrugsFromRack(reqBody: UpdateRackDrugRequestDto) {
    await this.rackService.removeDrugsFromRack(reqBody);
  }

  @Put('/branch/remove-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async removeDrugsFromBranchRack(
    @Req() req: any,
    reqBody: UpdateRackDrugRequestDto,
  ) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    await this.rackService.removeDrugsFromBranchRack(reqBody, branchId);
  }

  @Get('/:rackId/capacity-used')
  @UseGuards(
    CustomAuthGuard,
    new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]),
  )
  async getCapacityUsed(@Param('rackId') rackId: number) {
    return await this.rackService.getCapacityUsed(rackId);
  }
}
