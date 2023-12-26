import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RackEntity } from 'src/database/entities/rack.entity';
import { RackDrugEntity } from 'src/database/entities/rack-drug.entity';
import {
  CreateRackDrugRequestDto,
  CreateRackRequestDto,
  UpdateRackDrugRequestDto,
} from '../shared/dtos/rack/request.dto';
import { ERackType } from '../shared/constants';
import { DrugService } from '../drug/drug.service';

@Injectable()
export class RackService {
  constructor(
    @InjectRepository(RackEntity)
    private readonly rackRepo: Repository<RackEntity>,

    @InjectRepository(RackDrugEntity)
    private readonly rackDrugRepo: Repository<RackDrugEntity>,

    private readonly drugService: DrugService,
  ) {}

  async createTotalRack(reqBody: CreateRackRequestDto) {
    const newRack = this.rackRepo.create({ ...reqBody, type: ERackType.TOTAL });
    const existedVirtualRack = await this.rackRepo.findOneBy({
      type: ERackType.VIRTUAL,
      branchId: 0,
    });
    if (!existedVirtualRack) {
      const newVirtualRack = this.rackRepo.create({
        type: ERackType.VIRTUAL,
        capacity: reqBody.capacity,
      });
      await this.rackRepo.save(newVirtualRack);
    } else {
      await this.updateVirtualRack(
        existedVirtualRack.id,
        existedVirtualRack.capacity + reqBody.capacity,
      );
    }
    return await this.rackRepo.save(newRack);
  }

  async createBranchRack(reqBody: CreateRackRequestDto, branchId: number) {
    const newRack = this.rackRepo.create({
      ...reqBody,
      branchId,
      type: ERackType.BRANCH,
    });
    const existedVirtualRack = await this.rackRepo.findOneBy({
      type: ERackType.VIRTUAL,
      branchId: branchId,
    });
    if (!existedVirtualRack) {
      const newVirtualRack = this.rackRepo.create({
        type: ERackType.VIRTUAL,
        capacity: reqBody.capacity,
        branchId,
      });
      await this.rackRepo.save(newVirtualRack);
    } else {
      await this.updateVirtualRack(
        existedVirtualRack.id,
        existedVirtualRack.capacity + reqBody.capacity,
      );
    }
    return await this.rackRepo.save(newRack);
  }

  async getAllTotalRacks() {
    const res = await this.rackRepo.find({ where: { type: ERackType.TOTAL } });
    if (!res.length) return [];
  }

  async getAllBranchRacks() {
    const res = await this.rackRepo.find({ where: { type: ERackType.BRANCH } });
    if (!res.length) return [];
  }

  async getRacksByBranchId(branchId: number) {
    const res = await this.rackRepo.find({
      where: { type: ERackType.BRANCH, branchId },
    });
    if (!res.length) return [];
  }

  async getRackById(id: number) {
    const rack = await this.rackRepo.findOneBy({ id });
    if (!rack) throw new NotFoundException('Rack not found.');
    return rack;
  }

  async updateVirtualRack(rackId: number, capacity: number) {
    return await this.rackRepo.save({ id: rackId, capacity });
  }

  async addDrugsToBranchRack(
    reqBody: UpdateRackDrugRequestDto,
    branchId: number,
  ) {
    const rack = await this.getRackById(reqBody.rackId);
    if (!(rack.type === ERackType.BRANCH && rack.branchId === branchId)) {
      throw new ForbiddenException('You cannot add to this rack.');
    }
    return await this.addDrugsToRack(reqBody);
  }

  async addDrugsToRack(reqBody: UpdateRackDrugRequestDto) {
    const rackDrug = await this.rackDrugRepo.findOneBy({
      rackId: reqBody.rackId,
      drugId: reqBody.drugId,
    });
    if (!rackDrug) return await this.createRackDrug(reqBody);
    return await this.updateRackDrug(reqBody);
  }

  async removeDrugsFromBranchRack(
    reqBody: UpdateRackDrugRequestDto,
    branchId: number,
  ) {
    const rack = await this.getRackById(reqBody.rackId);
    if (!(rack.type === ERackType.BRANCH && rack.branchId === branchId)) {
      throw new ForbiddenException('You cannot move from this rack.');
    }
    return await this.removeDrugsFromRack(reqBody);
  }

  async removeDrugsFromRack(reqBody: UpdateRackDrugRequestDto) {
    const rackDrug = await this.rackDrugRepo.findOneBy({
      rackId: reqBody.rackId,
      drugId: reqBody.drugId,
    });
    if (!rackDrug) throw new BadRequestException('Rack drug not found.');
    if (reqBody.quantity > rackDrug.quantity)
      throw new BadRequestException('Quantity left not enough.');
    return await this.updateRackDrug({
      ...reqBody,
      quantity: reqBody.quantity * -1,
    });
  }

  async getCapacityLeft(rackId: number) {
    const [rack, drugsOfRack] = await Promise.all([
      this.getRackById(rackId),
      this.getAllDrugsOfRack(rackId),
    ]);
    let capacityUsed = 0;
    for (const rackDrug of drugsOfRack) {
      const drug = await this.drugService.getDrugById(rackDrug.drugId);
      capacityUsed += rackDrug.quantity * drug.size;
    }
    return rack.capacity - capacityUsed;
  }

  async createRackDrug(reqBody: CreateRackDrugRequestDto) {
    const { branchId, capacity } = await this.getRackById(reqBody.rackId);
    const drug = await this.drugService.getDrugById(reqBody.drugId);
    if (capacity - reqBody.quantity * drug.size < 0) {
      throw new BadRequestException('Out of capacity.');
    }
    const newRackDrug = this.rackDrugRepo.create(reqBody);
    const virtualRack = await this.rackRepo.findOneBy({
      type: ERackType.VIRTUAL,
      branchId,
    });
    await this.updateVirtualRack(
      reqBody.rackId,
      virtualRack.capacity - drug.size * reqBody.quantity,
    );
    return await this.rackDrugRepo.save(newRackDrug);
  }

  async updateRackDrug(reqBody: UpdateRackDrugRequestDto) {
    const { branchId } = await this.getRackById(reqBody.rackId);
    const capacityLeft = await this.getCapacityLeft(reqBody.rackId);
    const drug = await this.drugService.getDrugById(reqBody.drugId);
    if (capacityLeft - reqBody.quantity * drug.size < 0) {
      throw new BadRequestException('Out of capacity.');
    }
    const virtualRack = await this.rackRepo.findOneBy({
      type: ERackType.VIRTUAL,
      branchId,
    });
    await this.updateVirtualRack(
      reqBody.rackId,
      virtualRack.capacity - drug.size * reqBody.quantity,
    );
    return await this.rackDrugRepo.save(reqBody);
  }

  async getAllDrugsOfRack(rackId: number) {
    return await this.rackDrugRepo.find({ where: { rackId } });
  }
}
