import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../shared/dtos/user/request.dto';
import { UserService } from './user.service';

@Controller('user-public')
@UseInterceptors(ClassSerializerInterceptor)
export class UserPublicController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() reqBody: CreateUserDto) {
    return await this.userService.register(reqBody);
  }

  @Post('/login')
  async login(@Body() reqBody: LoginUserDto) {
    return await this.userService.login(reqBody);
  }
}
