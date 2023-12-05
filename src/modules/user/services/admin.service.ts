import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/database/entities/admin.entity';
import { UpdateProfileDto } from 'src/modules/shared/dtos/user/request.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
  ) {}

  async getById(userId: number) {
    console.log('Here admin id:', userId);
    const admin = await this.adminRepo.findOneBy({ userId });
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    return admin;
  }

  async updateProfile(userId: number, reqBody: UpdateProfileDto) {
    const admin = await this.adminRepo.findOneBy({ userId });
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    const newAdmin = { ...admin, ...reqBody };
    return await this.adminRepo.save(newAdmin);
  }
}
