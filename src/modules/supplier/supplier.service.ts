import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../shared/dtos/supplier/request.dto';
import { SupplierEntity } from 'src/database/entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepo: Repository<SupplierEntity>,
  ) {}

  async create(reqBody: CreateSupplierDto) {
    const existedSupplier = await this.supplierRepo.findOneBy({
      email: reqBody.email,
    });
    if (existedSupplier) {
      throw new BadRequestException('Supplier existed!');
    }
    const newSupplier = this.supplierRepo.create(reqBody);
    await this.supplierRepo.save(newSupplier);
    return {
      message: 'Created supplier!',
    };
  }

  async getAll() {
    return await this.supplierRepo.find();
  }

  async getSupplierById(id: number) {
    const supplier = await this.supplierRepo.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException('Supplier not found!');
    }
    return supplier;
  }

  async updateSupplier(id: number, reqBody: UpdateSupplierDto) {
    let supplier = await this.getSupplierById(id);
    supplier = { ...supplier, ...reqBody };
    await this.supplierRepo.save(supplier);
    return {
      message: 'Updated supplier!',
    };
  }
}
