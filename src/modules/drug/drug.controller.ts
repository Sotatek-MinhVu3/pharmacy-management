import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DrugService } from './drug.service';
import { RoleGuard } from 'src/guards/role.guard';
import { ERole } from '../shared/constants';
import { CreateDrugDto, UpdateDrugDto } from '../shared/dtos/drug/request.dto';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';

@Controller('drugs')
@UseInterceptors(ClassSerializerInterceptor)
export class DrugController {
  constructor(private drugService: DrugService) {}

  @Post('/create')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async createProduct(@Body() reqBody: CreateDrugDto) {
    return await this.drugService.create(reqBody);
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.drugService.getDrugById(id);
  }

  @Get('/category/:id')
  async getAllByCategory(@Param('id') id: number) {
    return await this.drugService.getAllByCategory(id, true);
  }

  @Get('/product-type/:id')
  async getAllByProductType(@Param('id') id: number) {
    return await this.drugService.getAllByDrugType(id);
  }

  @Get()
  async getAll() {
    return await this.drugService.getAll();
  }

  @Put('/:id')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async updateProduct(@Param('id') id: number, @Body() reqBody: UpdateDrugDto) {
    return await this.drugService.updateProduct(id, reqBody);
  }

  @Delete('/:id')
  @UseGuards(CustomAuthGuard, new RoleGuard([ERole.ADMIN]))
  async deleteProduct(@Param('id') id: number) {
    return await this.drugService.deleteProduct(id);
  }
}
