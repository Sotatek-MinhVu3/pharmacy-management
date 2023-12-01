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

@Controller('product')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DrugController {
  constructor(private drugService: DrugService) {}

  @Post('/create')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async createProduct(@Body() reqBody: CreateDrugDto) {
    return await this.drugService.create(reqBody);
  }

  @Get('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getById(@Param('id') id: number) {
    return await this.drugService.getDrugById(id, true);
  }

  @Get('/category/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getAllByCategory(@Param('id') id: number) {
    return await this.drugService.getAllByCategory(id, true);
  }

  @Get('/product-type/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getAllByProductType(@Param('id') id: number) {
    return await this.drugService.getAllByDrugType(id, true);
  }

  @Get()
  @UseGuards(new RoleGuard([ERole.ADMIN, ERole.BRANCH_ADMIN, ERole.STAFF]))
  async getAll() {
    return await this.drugService.getAll(true);
  }

  @Put('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async updateProduct(@Param('id') id: number, @Body() reqBody: UpdateDrugDto) {
    return await this.drugService.updateProduct(id, reqBody);
  }

  @Delete('/:id')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async deleteProduct(@Param('id') id: number) {
    return await this.drugService.deleteProduct(id);
  }
}
