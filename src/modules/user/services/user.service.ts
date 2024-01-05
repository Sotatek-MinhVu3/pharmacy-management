require('dotenv').config();
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  LoginUserDto,
  TransferUserRequestDto,
} from '../../shared/dtos/user/request.dto';
import { ERole, EUserStatus } from '../../shared/constants';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(reqBody: CreateUserDto, role: ERole) {
    const newUser = await this.create(reqBody, role);
    const access_token = await this.generateAccessToken(newUser);

    return {
      msg: 'Customer has been created successfully',
      access_token,
    };
  }

  async getAll() {
    return await this.userRepo.find();
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async getById(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async create(reqBody: CreateUserDto, role: ERole) {
    const existedUser = await this.getUserByEmail(reqBody.email);
    if (existedUser) {
      throw new BadRequestException('User existed!');
    }
    reqBody.password = await this.generateHashPassword(reqBody.password);

    const newUser = this.userRepo.create({ ...reqBody, role });
    return await this.userRepo.save(newUser);
  }

  async login(reqBody: LoginUserDto) {
    const existedUser = await this.getUserByEmail(reqBody.email);
    if (!existedUser) {
      throw new NotFoundException('User not found!');
    }

    const isMatched = await bcrypt.compare(
      reqBody.password,
      existedUser.password,
    );
    if (!isMatched) throw new BadRequestException('Invalid credentials');
    const access_token = await this.generateAccessToken(existedUser);
    return {
      msg: 'Login successfully',
      access_token,
    };
  }

  async transferUser(id: number, reqBody: TransferUserRequestDto) {
    const existedUser = await this.getById(id);
    const newPassword = await this.generateHashPassword(reqBody.password);
    const newUser = await this.userRepo.save({
      ...existedUser,
      email: reqBody.email,
      password: newPassword,
    });
    const access_token = await this.generateAccessToken(newUser);
    return {
      msg: 'User has been transferred successfully',
      access_token,
    };
  }

  private async generateAccessToken(user: UserEntity) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return access_token;
  }

  private async generateHashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
