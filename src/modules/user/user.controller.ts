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
import { CreateUserDto, UpdateUserDto } from '../shared/dtos/user/request.dto';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { GetProfileDto } from '../shared/dtos/user/response.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import { User } from '../../database/entities/user.entity';

@Controller('user')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/branch-admin')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createBranchAdmin(@Body() reqBody: CreateUserDto) {
    return await this.userService.createBranchAdmin(reqBody);
  }

  @Get('branch-admin')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAllBranchAdmin() {
    return await this.userService.getAll(ERole.BRANCH_ADMIN);
  }

  @Post('/staff')
  @UseGuards(new RoleGuard([ERole.BRANCH_ADMIN]))
  async createStaff(@Body() reqBody: CreateUserDto) {
    return await this.userService.createStaff(reqBody);
  }

  @Get()
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAllUsers() {
    return await this.userService.getAll(ERole.USER);
  }

  @Get('/profile')
  @UseGuards(
    new RoleGuard([ERole.USER, ERole.STAFF, ERole.BRANCH_ADMIN, ERole.ADMIN]),
  )
  async getProfile(@Req() request: Request) {
    return plainToClass(GetProfileDto, request.user, {
      excludeExtraneousValues: true,
    });
  }

  @Put('/profile')
  @UseGuards(
    new RoleGuard([ERole.USER, ERole.STAFF, ERole.BRANCH_ADMIN, ERole.ADMIN]),
  )
  async updateProfile(@Req() request: Request, @Body() reqBody: UpdateUserDto) {
    const user = plainToClass(User, request.user);
    return await this.userService.updateUser(user.id, reqBody);
  }

  @Delete('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
