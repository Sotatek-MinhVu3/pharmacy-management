import {
  BadRequestException,
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
import { ERackType, ERole } from '../shared/constants';
import {
  CreateRackRequestDto,
  UpdateRackDrugRequestDto,
  UpdateRackRequestDto,
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

  @Put('/total')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async updateTotalRack(@Body() reqBody: UpdateRackRequestDto) {
    const totalRack = await this.rackService.getRackById(reqBody.rackId);
    if (totalRack.type !== ERackType.TOTAL)
      throw new BadRequestException('This rack is not total rack.');
    return await this.rackService.updateRack(reqBody.rackId, reqBody.capacity);
  }

  @Put('/branch-warehouse')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async updateBranchWarehouse(@Body() reqBody: UpdateRackRequestDto) {
    const totalRack = await this.rackService.getRackById(reqBody.rackId);
    if (totalRack.type !== ERackType.BRANCH_WAREHOUSE)
      throw new BadRequestException('This rack is not branch warehouse.');
    return await this.rackService.updateRack(reqBody.rackId, reqBody.capacity);
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

  @Get('/branch-warehouse')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async getBranchRacks() {
    return await this.rackService.getAllBranchWarehouses();
  }

  @Get('/branch/:branchId')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async getBranchRacksById(@Param('branchId') branchId: number) {
    const branchRacks = await this.rackService.getRacksByBranchId(branchId);
    return branchRacks;
  }

  @Get('/my-branch')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getMyBranchRacks(@Req() req: any) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    const branchRacks = await this.rackService.getRacksByBranchId(branchId);
    return branchRacks;
  }

  @Get('/my-branch/branch-warehouse')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getMyBranchWarehouse(@Req() req: any) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    return await this.rackService.getBranchWarehouseByBranchId(branchId);
  }

  @Put('/add-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async addDrugsToRack(@Body() reqBody: UpdateRackDrugRequestDto) {
    await this.rackService.addDrugsToRack(reqBody);
  }

  @Post('/my-branch/create')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async createMyBranchRack(
    @Req() req: any,
    @Body() reqBody: CreateRackRequestDto,
  ) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    await this.rackService.createBranchRack(reqBody, branchId);
  }

  @Put('/my-branch/add-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async addDrugsToBranchRack(
    @Req() req: any,
    @Body() reqBody: UpdateRackDrugRequestDto,
  ) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    return await this.rackService.addDrugsToBranchRack(reqBody, branchId);
  }

  @Put('/remove-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async removeDrugsFromRack(@Body() reqBody: UpdateRackDrugRequestDto) {
    return await this.rackService.removeDrugsFromRack(reqBody);
  }

  @Put('/my-branch/branch-rack/remove-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async removeDrugsFromBranchRack(
    @Req() req: any,
    @Body() reqBody: UpdateRackDrugRequestDto,
  ) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    return await this.rackService.removeDrugsFromBranchRack(reqBody, branchId);
  }

  @Put('/my-branch/branch-warehouse/remove-drugs')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.BRANCH_ADMIN]))
  async removeDrugsFromBranchWarehouse(
    @Req() req: any,
    @Body() reqBody: UpdateRackDrugRequestDto,
  ) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    return await this.rackService.removeDrugsFromBranchWarehouse(
      reqBody,
      branchId,
    );
  }

  @Get('/:rackId/capacity-used')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async getCapacityUsed(@Param('rackId') rackId: number) {
    return await this.rackService.getCapacityUsed(rackId);
  }

  @Get('/my-branch/capacity-used')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN, ERole.STAFF]))
  async getMyCapacityUsed(@Req() req: any) {
    const { branchId } = plainToClass(GetUserFromRequestDto, req.user, {
      excludeExtraneousValues: true,
    });
    const branchWarehouse =
      await this.rackService.getBranchWarehouseByBranchId(branchId);
    return await this.rackService.getCapacityUsed(branchWarehouse.id);
  }
}
