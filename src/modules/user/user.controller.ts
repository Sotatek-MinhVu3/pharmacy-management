import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateBranchAdminDto,
  CreateStaffDto,
  CreateUserDto,
  UpdateUserDto,
} from '../shared/dtos/user/request.dto';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { GetProfileDto } from '../shared/dtos/user/response.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import { UserEntity } from '../../database/entities/user.entity';

@Controller('user')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/branch-admin')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createBranchAdmin(@Body() reqBody: CreateBranchAdminDto) {
    return await this.userService.createBranchAdmin(reqBody);
  }

  @Get('branch-admin')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAllBranchAdmin() {
    return await this.userService.getAllByRole(ERole.BRANCH_ADMIN);
  }

  @Post('/staff')
  @UseGuards(new RoleGuard([ERole.BRANCH_ADMIN]))
  async createStaff(@Body() reqBody: CreateStaffDto, @Req() request: Request) {
    const { branchId } = plainToClass(GetProfileDto, request.user, {
      excludeExtraneousValues: true,
    });
    return await this.userService.createStaff(reqBody, branchId);
  }

  @Post('/create-customer')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async register(@Body() reqBody: CreateUserDto) {
    return await this.userService.register(reqBody);
  }

  @Get()
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Get('/profile')
  @UseGuards(
    new RoleGuard([
      ERole.CUSTOMER,
      ERole.STAFF,
      ERole.BRANCH_ADMIN,
      ERole.ADMIN,
    ]),
  )
  async getProfile(@Req() request: Request) {
    return plainToClass(GetProfileDto, request.user, {
      excludeExtraneousValues: true,
    });
  }

  @Put('/profile')
  @UseGuards(
    new RoleGuard([
      ERole.CUSTOMER,
      ERole.STAFF,
      ERole.BRANCH_ADMIN,
      ERole.ADMIN,
    ]),
  )
  async updateProfile(@Req() request: Request, @Body() reqBody: UpdateUserDto) {
    const user = plainToClass(UserEntity, request.user);
    return await this.userService.updateUser(user.id, reqBody);
  }

  @Put('/activate/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async activateCustomer(@Param('id') id: number) {
    return await this.userService.activateCustomer(id);
  }

  @Put('/deactivate/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async deactivateCustomer(@Param('id') id: number) {
    return await this.userService.deactivateCustomer(id);
  }
}
