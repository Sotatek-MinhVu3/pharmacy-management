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
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ERackType, ERole } from '../shared/constants';
import { RackService } from './rack.service';
import { CreateRackDto, UpdateRackDto } from '../shared/dtos/rack/request.dto';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { GetUserFromRequestDto } from '../shared/dtos/user/response.dto';

@Controller('rack')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class RackController {
  constructor(private rackService: RackService) {}

  @Post('/create')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN]))
  async createRack(@Req() request: Request, @Body() reqBody: CreateRackDto) {
    const { role } = plainToClass(GetUserFromRequestDto, request.user, {
      excludeExtraneousValues: true,
    });
    if (role === ERole.ADMIN) {
      return await this.rackService.create(reqBody, ERackType.TOTAL);
    }
    return await this.rackService.create(reqBody, ERackType.BRANCH);
  }

  @Get()
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAll() {
    return await this.rackService.getAll();
  }

  @Get('/by-branch/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN]))
  async getRacksByBranchId(@Req() request: Request, @Param('id') id: number) {
    const { role, branchId } = plainToClass(
      GetUserFromRequestDto,
      request.user,
      {
        excludeExtraneousValues: true,
      },
    );
    if (role === ERole.ADMIN) {
      return await this.rackService.getAllByBranchId(id);
    }
    return await this.rackService.getAllByBranchId(branchId);
  }

  @Get('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN]))
  async getRackById(@Req() request: Request, @Param('id') id: number) {
    const { role } = plainToClass(GetUserFromRequestDto, request.user, {
      excludeExtraneousValues: true,
    });
    return await this.rackService.getRackById(role, id);
  }

  @Put('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN]))
  async updateRack(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() reqBody: UpdateRackDto,
  ) {
    const { role } = plainToClass(GetUserFromRequestDto, request.user, {
      excludeExtraneousValues: true,
    });
    return await this.rackService.updateById(role, id, reqBody);
  }
}
