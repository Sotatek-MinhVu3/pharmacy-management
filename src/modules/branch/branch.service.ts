import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchEntity } from '../../database/entities/branch.entity';
import {
  CreateBranchDto,
  UpdateBranchDto,
} from '../shared/dtos/branch/request.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
  ) {}

  async create(reqBody: CreateBranchDto) {
    const newBranch = this.branchRepo.create(reqBody);
    await this.branchRepo.save(newBranch);
    return {
      message: 'Branch has been created successfully!',
    };
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
    const branch = await this.getBranchById(branchId);
    await this.branchRepo.softDelete(branch.id);
    return {
      message: 'Deleted branch successfully!',
    };
  }

  async updateBranch(branchId: number, reqBody: UpdateBranchDto) {
    let branch = await this.getBranchById(branchId);
    branch = { ...branch, ...reqBody };
    await this.branchRepo.save(branch);
    return {
      message: 'Updated branch!',
    };
  }
}
