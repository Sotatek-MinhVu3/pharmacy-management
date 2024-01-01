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
import { BranchService } from 'src/modules/branch/branch.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,
    private readonly userService: UserService,
    private readonly branchService: BranchService,
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
    const [staffs, branches] = await Promise.all([
      this.staffRepo.find(),
      this.branchService.getAllBranches(),
    ]);
    const res = staffs.map((staff) => {
      const branchName = branches.find(
        (branch) => branch.id === staff.branchId,
      ).name;
      return { ...staff, branchName: branchName };
    });
    return res;
  }

  async getById(userId: number) {
    const [staff, branches] = await Promise.all([
      this.staffRepo.findOneBy({ userId }),
      this.branchService.getAllBranches(),
    ]);
    if (!staff) {
      throw new NotFoundException('Staff not found.');
    }
    const branchName = branches.find(
      (branch) => branch.id === staff.branchId,
    ).name;
    return { ...staff, branchName: branchName };
  }

  async getAllByBranchId(branchId: number) {
    const [staffs, branches] = await Promise.all([
      this.staffRepo.findBy({ branchId }),
      this.branchService.getAllBranches(),
    ]);
    if (!staffs.length) {
      throw new NotFoundException('Staff by branch id not found.');
    }
    const res = staffs.map((staff) => {
      const branchName = branches.find(
        (branch) => branch.id === staff.branchId,
      ).name;
      return { ...staff, branchName: branchName };
    });
    return res;
  }

  async updateProfile(userId: number, reqBody: UpdateProfileDto) {
    const staff = await this.staffRepo.findOneBy({ userId });
    if (!staff) {
      throw new NotFoundException('Staff not found.');
    }
    const newStaff = { ...staff, ...reqBody };
    return await this.staffRepo.save(newStaff);
  }

  async deleteStaff(userId: number) {
    await this.staffRepo.softDelete(userId);
    return { message: 'Deleted staff.' };
  }
}
