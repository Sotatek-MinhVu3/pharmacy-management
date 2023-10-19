import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../../database/entities/branch.entity';
import {
  CreateBranchDto,
  UpdateBranchDto,
} from '../shared/dtos/branch/request.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
  ) {}

  async create(reqBody: CreateBranchDto) {
    const newUser = this.branchRepo.create(reqBody);
    return await this.branchRepo.save(newUser);
  }

  async getAllBranches() {
    return await this.branchRepo.find();
  }

  async getBranchById(branchId: number) {
    const branch = await this.branchRepo.findOneBy({ id: branchId });
    if (!branch) {
      throw new NotFoundException('Branch not found!');
    }
    return branch;
  }

  async deleteBranch(branchId: number) {
    const branch = await this.branchRepo.findOneBy({ id: branchId });
    if (!branch) {
      throw new NotFoundException('Branch not found!');
    }
    await this.branchRepo.softDelete(branchId);
    return {
      message: 'Deleted branch successfully!',
    };
  }

  async updateBranch(branchId: number, reqBody: UpdateBranchDto) {
    let branch = await this.branchRepo.findOneBy({ id: branchId });
    branch = { ...branch, ...reqBody };
    await this.branchRepo.save(branch);
    return {
      message: 'Updated branch!',
    };
  }
}
