import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/database/entities/customer.entity';
import { ERole, EUserStatus } from 'src/modules/shared/constants';
import {
  CreateCustomerDto,
  UpdateProfileDto,
} from 'src/modules/shared/dtos/user/request.dto';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    private readonly userService: UserService,
  ) {}

  async createCustomer(reqBody: CreateCustomerDto) {
    const newUser = await this.userService.create(
      { email: reqBody.email, password: reqBody.password },
      ERole.CUSTOMER,
    );
    const newCustomer = this.customerRepo.create({
      ...reqBody,
      userId: newUser.id,
    });
    return await this.customerRepo.save(newCustomer);
  }

  async activateCustomer(userId: number) {
    const user = await this.customerRepo.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('Customer not found!');
    }
    if (user.status === EUserStatus.ACTIVE) {
      throw new BadRequestException('Customer is already active!');
    }
    await this.customerRepo.save({ ...user, status: EUserStatus.ACTIVE });
    return {
      message: 'Activated customer!',
    };
  }

  async deactivateCustomer(userId: number) {
    const user = await this.customerRepo.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('Customer not found!');
    }
    if (user.status === EUserStatus.INACTIVE) {
      throw new BadRequestException('Customer is already deactivated!');
    }
    await this.customerRepo.save({ ...user, status: EUserStatus.INACTIVE });
    return {
      message: 'Deactivated customer!',
    };
  }

  async getById(userId: number) {
    const customer = await this.customerRepo.findOneBy({ userId });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    return customer;
  }

  async getAll() {
    return await this.customerRepo.find();
  }

  async updateProfile(userId: number, reqBody: UpdateProfileDto) {
    const customer = await this.customerRepo.findOneBy({ userId });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
    const newCustomer = { ...customer, ...reqBody };
    return await this.customerRepo.save(newCustomer);
  }
}
