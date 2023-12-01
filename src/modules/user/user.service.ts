require('dotenv').config();
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateBranchAdminDto,
  CreateStaffDto,
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from '../shared/dtos/user/request.dto';
import { ERole, EUserStatus } from '../shared/constants';
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

  async register(reqBody: CreateUserDto) {
    const newUser = await this.create(reqBody, ERole.CUSTOMER);
    await this.userRepo.save(newUser);

    const access_token = await this.generateAccessToken(newUser);

    return {
      msg: 'Customer has been created successfully',
      access_token,
    };
  }

  async createBranchAdmin(reqBody: CreateBranchAdminDto) {
    const branchAdmins = await this.getAllByRole(ERole.BRANCH_ADMIN);
    const existedBranchAdmins = branchAdmins.filter(
      (bra) => bra.branchId === reqBody.branchId,
    );
    if (existedBranchAdmins.length) {
      throw new BadRequestException('This branch already has a manager!');
    }
    const newBranchAdmin = await this.create(reqBody, ERole.BRANCH_ADMIN);
    await this.userRepo.save(newBranchAdmin);

    const access_token = await this.generateAccessToken(newBranchAdmin);

    return {
      msg: 'Branch admin has been created successfully',
      access_token,
    };
  }

  async createStaff(reqBody: CreateStaffDto, branchId: number) {
    const newStaff = await this.create(reqBody, ERole.STAFF);
    newStaff.branchId = branchId;
    await this.userRepo.save(newStaff);

    const access_token = await this.generateAccessToken(newStaff);

    return {
      msg: 'Staff has been created successfully',
      access_token,
    };
  }

  async getAllByRole(role: ERole) {
    return await this.userRepo.find({ where: { role } });
  }

  async getAll() {
    return await this.userRepo.find();
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async getUserById(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async activateCustomer(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    if (user.status === EUserStatus.ACTIVE) {
      throw new BadRequestException('Customer is already active!');
    }
    await this.userRepo.save({ ...user, status: EUserStatus.ACTIVE });
    return {
      message: 'Activated customer!',
    };
  }

  async deactivateCustomer(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    if (user.status === EUserStatus.INACTIVE) {
      throw new BadRequestException('Customer is already deactivated!');
    }
    await this.userRepo.save({ ...user, status: EUserStatus.INACTIVE });
    return {
      message: 'Deactivated customer!',
    };
  }

  async updateUser(userId: number, reqBody: UpdateUserDto) {
    let user = await this.userRepo.findOneBy({ id: userId });
    user = { ...user, ...reqBody };
    await this.userRepo.save(user);
    return {
      message: 'Updated user!',
    };
  }

  async create(reqBody: CreateUserDto, role: ERole) {
    const existedUser = await this.getUserByEmail(reqBody.email);
    if (existedUser) {
      throw new BadRequestException('User existed!');
    }
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);
    reqBody.password = hashedPassword;

    const newUser = this.userRepo.create({ ...reqBody, role });
    return newUser;
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

  private async generateAccessToken(user: UserEntity) {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return access_token;
  }
}
