import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DrugEntity } from 'src/database/entities/drug.entity';
import { CreateDrugDto, UpdateDrugDto } from '../shared/dtos/drug/request.dto';
import { DrugTypeService } from '../category/drug-type/drug-type.service';

@Injectable()
export class DrugService {
  constructor(
    @InjectRepository(DrugEntity)
    private readonly drugRepo: Repository<DrugEntity>,
    private readonly drugTypeService: DrugTypeService,
  ) {}

  async create(reqBody: CreateDrugDto) {
    const existedDrug = await this.drugRepo.findOneBy({
      barcode: reqBody.barcode,
    });
    if (existedDrug) {
      throw new BadRequestException('Drug existed!');
    }
    const drug = {
      name: reqBody.name,
      typeId: reqBody.typeId,
      supplierId: reqBody.supplierId,
      soldAsDose: reqBody.soldAsDose,
      sensitiveIngredients: reqBody.sensitiveIngredients
        ? JSON.stringify(reqBody.sensitiveIngredients)
        : null,
      description: reqBody.description,
      unit: reqBody.unit,
      barcode: reqBody.barcode,
      size: reqBody.size,
      price: reqBody.price,
    };
    const newDrug = this.drugRepo.create(drug);
    await this.drugRepo.save(newDrug);
    return newDrug;
  }

  async getAll() {
    return await this.drugRepo.find();
  }

  async getAllByCategory(categoryId: number, isManager: boolean) {
    const drugTypes = await this.drugTypeService.getAllByCategoryId(categoryId);
    let drugs = [];
    for (let drugType of drugTypes) {
      const drugsByType = await this.getAllByDrugType(drugType.id);
      drugs.push(drugsByType);
    }
    return drugs.flat();
  }

  async getAllByDrugType(typeId: number) {
    let drugs: DrugEntity[];
    drugs = await this.drugRepo.find({
      where: { typeId },
    });

    if (!drugs.length) {
      return [];
    } else return drugs;
  }

  async getDrugById(id: number) {
    let drug: DrugEntity;
    drug = await this.drugRepo.findOneBy({ id });

    if (!drug) {
      throw new NotFoundException('Drug not found!');
    }
    return drug;
  }

  async getDrugByBarcode(barcode: number) {
    const drug = await this.drugRepo.findOneBy({ barcode });
    if (!drug) {
      throw new NotFoundException('Drug not found!');
    }
    return drug;
  }

  async getDrugsByIds(ids: number[]) {
    return await this.drugRepo.find({ where: { id: In([...ids]) } });
  }

  async updateDrug(id: number, reqBody: UpdateDrugDto) {
    let drug = await this.getDrugById(id);
    const sensitiveIngredients = reqBody.sensitiveIngredients
      ? JSON.stringify(reqBody.sensitiveIngredients)
      : null;
    drug = { ...drug, ...reqBody, sensitiveIngredients };
    return await this.drugRepo.save(drug);
  }

  async deleteDrug(id: number) {
    let drug = await this.getDrugById(id);
    await this.drugRepo.softDelete(id);
    return {
      message: 'Deleted drug!',
    };
  }
}
