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
import { UserService } from './services/user.service';
import {
  CreateBranchAdminDto,
  CreateStaffDto,
  CreateUserDto,
  UpdateProfileDto,
} from '../shared/dtos/user/request.dto';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import {
  GetProfileDto,
  GetUserFromRequestDto,
} from '../shared/dtos/user/response.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import { UserEntity } from '../../database/entities/user.entity';
import { BranchAdminService } from './services/branch-admin.service';
import { CustomerService } from './services/customer.service';
import { StaffService } from './services/staff.service';
import { AdminService } from './services/admin.service';

@Controller('user')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private branchAdminService: BranchAdminService,
    private staffService: StaffService,
    private customerService: CustomerService,
  ) {}

  //branch admin
  @Post('/branch-admin')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createBranchAdmin(@Body() reqBody: CreateBranchAdminDto) {
    return await this.branchAdminService.createBranchAdmin(reqBody);
  }

  @Get('/branch-admin')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAllBranchAdmin() {
    return await this.branchAdminService.getAll();
  }

  @Get('/branch-admin/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getBranchAdminById(@Param('id') id: number) {
    return await this.branchAdminService.getById(id);
  }

  //staff
  @Post('/staff')
  @UseGuards(new RoleGuard([ERole.BRANCH_ADMIN]))
  async createStaff(@Body() reqBody: CreateStaffDto, @Req() request: Request) {
    const { branchId } = plainToClass(GetProfileDto, request.user, {
      excludeExtraneousValues: true,
    });
    return await this.staffService.createStaff(reqBody, branchId);
  }

  @Get('/staff')
  @UseGuards(new RoleGuard([ERole.BRANCH_ADMIN, ERole.ADMIN]))
  async gettAllStaffs(
    @Req() request: Request,
    @Body() reqBody: CreateStaffDto,
  ) {
    const { role, branchId } = plainToClass(
      GetUserFromRequestDto,
      request.user,
      {
        excludeExtraneousValues: true,
      },
    );
    switch (role) {
      case ERole.ADMIN:
        return await this.staffService.getAll();
      case ERole.BRANCH_ADMIN:
        return await this.staffService.getAllByBranchId(branchId);
      default:
        throw new Error('Error when get staffs.');
    }
  }

  @Get('/staff/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN]))
  async getStaffById(@Param('id') id: number) {
    return await this.staffService.getById(id);
  }

  //customer
  @Post('/create-customer')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async createCustomer(@Body() reqBody: CreateUserDto) {
    return await this.userService.register(reqBody, ERole.CUSTOMER);
  }

  @Put('/activate/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async activateCustomer(@Param('id') id: number) {
    return await this.customerService.activateCustomer(id);
  }

  @Put('/deactivate/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async deactivateCustomer(@Param('id') id: number) {
    return await this.customerService.deactivateCustomer(id);
  }

  @Get('/customer')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getAllCustomers() {
    return await this.customerService.getAll();
  }

  @Get('/customer/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getUserById(@Param('id') id: number) {
    return await this.customerService.getById(id);
  }

  //profile
  @Get('/profile')
  @UseGuards(
    new RoleGuard([
      ERole.ADMIN,
      ERole.BRANCH_ADMIN,
      ERole.STAFF,
      ERole.CUSTOMER,
    ]),
  )
  async getProfile(@Req() request: Request) {
    const { id, role } = plainToClass(GetUserFromRequestDto, request.user, {
      excludeExtraneousValues: true,
    });
    switch (role) {
      case ERole.ADMIN:
        const admin = await this.adminService.getById(id);
        return plainToClass(GetProfileDto, admin, {
          excludeExtraneousValues: true,
        });
      case ERole.BRANCH_ADMIN:
        const branchAdmin = await this.branchAdminService.getById(id);
        return plainToClass(GetProfileDto, branchAdmin, {
          excludeExtraneousValues: true,
        });
      case ERole.STAFF:
        const staff = await this.staffService.getById(id);
        return plainToClass(GetProfileDto, staff, {
          excludeExtraneousValues: true,
        });
      case ERole.CUSTOMER:
        const customer = await this.customerService.getById(id);
        return plainToClass(GetProfileDto, customer, {
          excludeExtraneousValues: true,
        });
      default:
        throw new Error('Error when get profile.');
    }
  }

  @Put('/profile')
  @UseGuards(
    new RoleGuard([
      ERole.ADMIN,
      ERole.BRANCH_ADMIN,
      ERole.STAFF,
      ERole.CUSTOMER,
    ]),
  )
  async updateProfile(
    @Req() request: Request,
    @Body() reqBody: UpdateProfileDto,
  ) {
    const { id, role } = plainToClass(GetUserFromRequestDto, request.user, {
      excludeExtraneousValues: true,
    });
    switch (role) {
      case ERole.ADMIN:
        const admin = await this.adminService.updateProfile(id, reqBody);
        return plainToClass(GetProfileDto, admin, {
          excludeExtraneousValues: true,
        });
      case ERole.BRANCH_ADMIN:
        const branchAdmin = await this.branchAdminService.updateProfile(
          id,
          reqBody,
        );
        return plainToClass(GetProfileDto, branchAdmin, {
          excludeExtraneousValues: true,
        });
      case ERole.STAFF:
        const staff = await this.staffService.updateProfile(id, reqBody);
        return plainToClass(GetProfileDto, staff, {
          excludeExtraneousValues: true,
        });
      case ERole.CUSTOMER:
        const customer = await this.customerService.updateProfile(id, reqBody);
        return plainToClass(GetProfileDto, customer, {
          excludeExtraneousValues: true,
        });
      default:
        throw new Error('Error when update profile.');
    }
  }
}
