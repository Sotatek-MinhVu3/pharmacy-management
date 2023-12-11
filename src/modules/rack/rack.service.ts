import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRackDto, UpdateRackDto } from '../shared/dtos/rack/request.dto';
import { RackEntity } from 'src/database/entities/rack.entity';
import { ERackType, ERole } from '../shared/constants';
import { RackDrugEntity } from 'src/database/entities/rack-drug.entity';

@Injectable()
export class RackService {
  constructor(
    @InjectRepository(RackEntity)
    private readonly rackRepo: Repository<RackEntity>,
    @InjectRepository(RackDrugEntity)
    private readonly rackDrugRepo: Repository<RackDrugEntity>,
  ) {}

  async create(reqBody: CreateRackDto, type: ERackType) {
    const newRack = await this.rackRepo.create({ ...reqBody, type });
    return await this.rackRepo.save(newRack);
  }

  async getAll() {
    return await this.rackRepo.find();
  }

  async getAllByBranchId(branchId: number) {
    const racks = await this.rackRepo.findBy({
      type: ERackType.BRANCH,
      branchId,
    });
    if (!racks.length) {
      throw new NotFoundException('Racks not found.');
    }
    return racks;
  }

  async getAllTotalBranches() {
    return await this.rackRepo.findBy({ type: ERackType.TOTAL });
  }

  async getRackById(role: ERole, id: number) {
    let rack = null;
    if (role === ERole.ADMIN) {
      rack = await this.rackRepo.findOneBy({ id });
    } else {
      rack = await this.rackRepo.findOneBy({
        id,
        type: ERackType.BRANCH,
      });
    }

    if (!rack) {
      throw new NotFoundException('Cannot get rack by id.');
    }
    return rack;
  }

  async updateById(role: ERole, id: number, reqBody: UpdateRackDto) {
    const existedRack = await this.rackRepo.findOneBy({ id });
    if (!existedRack) {
      throw new NotFoundException('Rack not found.');
    }
    if (
      !(
        (role === ERole.ADMIN && existedRack.type === ERackType.TOTAL) ||
        (role === ERole.BRANCH_ADMIN && existedRack.type === ERackType.BRANCH)
      )
    ) {
      throw new BadRequestException('Wrong permission when update rack');
    }
    return await this.rackRepo.save({ ...existedRack, ...reqBody });
  }

  async addDrugsToRack(rackId: number, drugId: number, quantity: number) {}

  async getCapacity(role: ERole, rackId: number) {
    const rack = await this.getRackById(role, rackId);
  }

  async checkCapacity(rackId: number) {}
}
