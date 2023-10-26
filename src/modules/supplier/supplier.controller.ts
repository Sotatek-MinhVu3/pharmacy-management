import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../shared/dtos/supplier/request.dto';

@Controller('supplier')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post('/create')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createSupplier(@Body() reqBody: CreateSupplierDto) {
    return await this.supplierService.create(reqBody);
  }

  @Get()
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getAll() {
    return await this.supplierService.getAll();
  }

  @Put('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateSupplier(
    @Param('id') id: number,
    @Body() reqBody: UpdateSupplierDto,
  ) {
    return await this.supplierService.updateSupplier(id, reqBody);
  }
}
