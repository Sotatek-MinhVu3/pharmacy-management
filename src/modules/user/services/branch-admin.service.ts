import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchAdminEntity } from 'src/database/entities/branch-admin.entity';
import {
  CreateBranchAdminDto,
  UpdateProfileDto,
} from 'src/modules/shared/dtos/user/request.dto';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { ERole } from 'src/modules/shared/constants';

@Injectable()
export class BranchAdminService {
  constructor(
    @InjectRepository(BranchAdminEntity)
    private readonly branchAdminRepo: Repository<BranchAdminEntity>,
    private readonly userService: UserService,
  ) {}

  async getAll() {
    return await this.branchAdminRepo.find();
  }

  async createBranchAdmin(reqBody: CreateBranchAdminDto) {
    const branchAdmins = await this.getAll();
    const existedBranchAdmins = branchAdmins.filter(
      (bra) => bra.branchId === reqBody.branchId,
    );
    if (existedBranchAdmins.length) {
      throw new BadRequestException('This branch already has a manager!');
    }
    const user = await this.userService.create(
      { email: reqBody.email, password: reqBody.password },
      ERole.BRANCH_ADMIN,
    );
    const newBranchAdmin = this.branchAdminRepo.create({
      ...reqBody,
      userId: user.id,
    });
    return await this.branchAdminRepo.save(newBranchAdmin);
  }

  async getById(userId: number) {
    const branchAdmin = await this.branchAdminRepo.findOneBy({ userId });
    if (!branchAdmin) {
      throw new NotFoundException('Branch admin not found.');
    }
    return branchAdmin;
  }

  async updateProfile(userId: number, reqBody: UpdateProfileDto) {
    const branchAdmin = await this.branchAdminRepo.findOneBy({ userId });
    if (!branchAdmin) {
      throw new NotFoundException('Branch admin not found.');
    }
    const newbranchAdmin = { ...branchAdmin, ...reqBody };
    return await this.branchAdminRepo.save(newbranchAdmin);
  }
}
