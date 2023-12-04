import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateCustomerDto,
  LoginUserDto,
} from '../shared/dtos/user/request.dto';
import { UserService } from './services/user.service';
import { CustomerService } from './services/customer.service';

@Controller('user-public')
@UseInterceptors(ClassSerializerInterceptor)
export class UserPublicController {
  constructor(
    private userService: UserService,
    private readonly customerService: CustomerService,
  ) {}

  @Post('/register')
  async register(@Body() reqBody: CreateCustomerDto) {
    return await this.customerService.createCustomer(reqBody);
  }

  @Post('/login')
  async login(@Body() reqBody: LoginUserDto) {
    return await this.userService.login(reqBody);
  }
}
