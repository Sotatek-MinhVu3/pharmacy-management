import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffEntity } from 'src/database/entities/staff.entity';
import {
  CreateStaffDto,
  UpdateProfileDto,
  UpdateStaffDto,
} from 'src/modules/shared/dtos/user/request.dto';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { ERole } from 'src/modules/shared/constants';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,
    private readonly userService: UserService,
  ) {}

  async createStaff(reqBody: CreateStaffDto, branchId: number) {
    const newUser = await this.userService.create(
      { email: reqBody.email, password: reqBody.password },
      ERole.STAFF,
    );
    const newStaff = this.staffRepo.create({
      ...reqBody,
      userId: newUser.id,
      branchId,
    });
    return await this.staffRepo.save(newStaff);
  }

  async updateStaff(userId: number, reqBody: UpdateStaffDto) {
    let staff = await this.getById(userId);
    staff = { ...staff, ...reqBody };
    return await this.staffRepo.save(staff);
  }

  async getAll() {
    return await this.staffRepo.find();
  }

  async getById(userId: number) {
    const staff = await this.staffRepo.findOneBy({ userId });
    if (!staff) {
      throw new NotFoundException('Staff not found.');
    }
    return staff;
  }

  async getAllByBranchId(branchId: number) {
    const staffs = await this.staffRepo.findBy({ branchId });
    if (!staffs.length) {
      throw new NotFoundException('Staff by branch id not found.');
    }
    return staffs;
  }

  async updateProfile(userId: number, reqBody: UpdateProfileDto) {
    const staff = await this.staffRepo.findOneBy({ userId });
    if (!staff) {
      throw new NotFoundException('Staff not found.');
    }
    const newStaff = { ...staff, ...reqBody };
    return await this.staffRepo.save(newStaff);
  }
}
