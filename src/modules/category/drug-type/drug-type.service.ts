import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrugTypeEntity } from 'src/database/entities/drug-type.entity';
import {
  CreateDrugTypeDto,
  UpdateDrugTypeDto,
} from 'src/modules/shared/dtos/drug-type/request.dto';
import { slugify } from 'src/utils/slug.utils';

@Injectable()
export class DrugTypeService {
  constructor(
    @InjectRepository(DrugTypeEntity)
    private readonly drugTypeRepo: Repository<DrugTypeEntity>,
  ) {}

  async create(reqBody: CreateDrugTypeDto) {
    const slug = slugify(reqBody.name);
    const existedDrugType = await this.getDrugTypeBySlug(slug);
    if (existedDrugType) {
      throw new BadRequestException('Drug type existed!');
    }
    const newDrugType = this.drugTypeRepo.create({ ...reqBody, slug });
    await this.drugTypeRepo.save(newDrugType);
    return newDrugType;
  }

  async getDrugTypeBySlug(slug: string) {
    const drugType = await this.drugTypeRepo.findOneBy({ slug });
    if (!drugType) {
      throw new NotFoundException('Drug type not found!');
    }
    return drugType;
  }

  async getDrugTypeById(id: number) {
    const drugType = await this.drugTypeRepo.findOneBy({ id });
    if (!drugType) {
      throw new NotFoundException('Drug type not found!');
    }
    return drugType;
  }

  async getAllByCategoryId(categoryId: number) {
    const types = await this.drugTypeRepo.findBy({ categoryId });
    if (!types.length) {
      throw new NotFoundException('Category not found!');
    }
    return types;
  }

  async updateDrugType(
    categoryId: number,
    id: number,
    reqBody: UpdateDrugTypeDto,
  ) {
    let drugType = await this.drugTypeRepo.findOneBy({ categoryId, id });
    drugType = { ...drugType, ...reqBody };
    return await this.drugTypeRepo.save(drugType);
  }
}
