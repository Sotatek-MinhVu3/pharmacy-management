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
import { DrugEntity } from 'src/database/entities/drug.entity';

@Injectable()
export class RackService {
  constructor(
    @InjectRepository(RackEntity)
    private readonly rackRepo: Repository<RackEntity>,

    @InjectRepository(RackDrugEntity)
    private readonly rackDrugRepo: Repository<RackDrugEntity>,

    private readonly drugService: DrugService,
  ) {}

  async createRack(
    reqBody: CreateRackRequestDto,
    type: ERackType,
    branchId: number,
  ) {
    const newRack = this.rackRepo.create({ ...reqBody, type, branchId });
    return await this.rackRepo.save(newRack);
  }

  async createTotalRack(reqBody: CreateRackRequestDto) {
    const existedTotalRack = await this.rackRepo.findOneBy({
      type: ERackType.TOTAL,
    });
    if (existedTotalRack)
      throw new BadRequestException('Total rack already existed.');
    return await this.createRack(reqBody, ERackType.TOTAL, 0);
  }

  async createBranchRack(reqBody: CreateRackRequestDto, branchId: number) {
    return await this.createRack(reqBody, ERackType.BRANCH, branchId);
  }

  async createBranchWarehouse(reqBody: CreateRackRequestDto, branchId: number) {
    const existedBranchWarehouse = await this.rackRepo.findOneBy({
      type: ERackType.BRANCH_WAREHOUSE,
      branchId,
    });
    if (existedBranchWarehouse)
      throw new BadRequestException('Branch warehouse already existed.');
    return await this.createRack(reqBody, ERackType.BRANCH_WAREHOUSE, branchId);
  }

  async getTotalRack() {
    const totalRack = await this.rackRepo.findOneBy({ type: ERackType.TOTAL });
    const drugs = await this.getAllDrugsOfRack(totalRack.id);
    const capacityUsed = await this.getCapacityUsed(totalRack.id);
    return { capacityUsed, drugs, capacity: totalRack.capacity };
  }

  async getAllBranchRacks() {
    let res = [];
    const branchRacks = await this.rackRepo.find({
      where: { type: ERackType.BRANCH },
    });
    if (!branchRacks.length) return [];
    for (const branchRack of branchRacks) {
      const drugs = await this.getAllDrugsOfRack(branchRack.id);
      const capacityUsed = await this.getCapacityUsed(branchRack.id);
      res.push({
        ...drugs,
        branchId: branchRack.branchId,
        capacityUsed,
        capacity: branchRack.capacity,
      });
    }
    return res;
  }

  async getAllBranchWarehouses() {
    let res = [];
    const branchWarehouses = await this.rackRepo.find({
      where: { type: ERackType.BRANCH_WAREHOUSE },
    });
    if (!branchWarehouses.length) return [];
    for (const branchWarehouse of branchWarehouses) {
      const drugs = await this.getAllDrugsOfRack(branchWarehouse.id);
      const capacityUsed = await this.getCapacityUsed(branchWarehouse.id);
      res.push({
        ...drugs,
        branchId: branchWarehouse.branchId,
        capacityUsed,
        capacity: branchWarehouse.capacity,
      });
    }
    return res;
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

  async updateRack(rackId: number, capacity: number) {
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

  async getBranchWarehouseByBranchId(branchId: number) {
    return await this.rackRepo.findOneBy({
      type: ERackType.BRANCH_WAREHOUSE,
      branchId,
    });
  }

  async addDrugsToRack(reqBody: UpdateRackDrugRequestDto) {
    const rackDrug = await this.rackDrugRepo.findOneBy({
      rackId: reqBody.rackId,
      drugId: reqBody.drugId,
    });
    if (!rackDrug) return await this.createRackDrug(reqBody);
    await this.validateCapacityLeft(reqBody);
    return await this.updateRackDrug({
      ...reqBody,
      quantity: rackDrug.quantity + reqBody.quantity,
    });
  }

  async removeDrugsFromBranchRack(
    reqBody: UpdateRackDrugRequestDto,
    branchId: number,
  ) {
    const rack = await this.getRackById(reqBody.rackId);
    if (!(rack.type === ERackType.BRANCH && rack.branchId === branchId)) {
      throw new ForbiddenException('You cannot remove drugs from this rack.');
    }
    const drug = await this.drugService.getDrugById(reqBody.drugId);
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
      quantity: rackDrug.quantity - reqBody.quantity,
    });
  }

  async getCapacityLeft(rackId: number) {
    const rack = await this.getRackById(rackId);
    const capacityUsed = await this.getCapacityUsed(rackId);
    return rack.capacity - capacityUsed;
  }

  async getCapacityUsed(rackId: number) {
    const drugsOfRack = await this.getAllDrugsOfRack(rackId);
    let capacityUsed = 0;
    for (const drug of drugsOfRack) {
      capacityUsed += drug.quantity * drug.size;
    }
    return capacityUsed;
  }

  async createRackDrug(reqBody: CreateRackDrugRequestDto) {
    const { branchId, capacity } = await this.getRackById(reqBody.rackId);
    const drug = await this.drugService.getDrugById(reqBody.drugId);
    if (capacity - reqBody.quantity * drug.size < 0) {
      throw new BadRequestException('Out of capacity.');
    }
    const newRackDrug = this.rackDrugRepo.create(reqBody);
    return await this.rackDrugRepo.save(newRackDrug);
  }

  async updateRackDrug(reqBody: UpdateRackDrugRequestDto) {
    return await this.rackDrugRepo.save(reqBody);
  }

  private async validateCapacityLeft(reqBody: UpdateRackDrugRequestDto) {
    const capacityLeft = await this.getCapacityLeft(reqBody.rackId);
    const drug = await this.drugService.getDrugById(reqBody.drugId);
    if (capacityLeft - reqBody.quantity * drug.size < 0) {
      throw new BadRequestException('Out of capacity.');
    }
  }

  async getAllDrugsOfRack(rackId: number) {
    const rackDrugs = await this.rackDrugRepo.find({ where: { rackId } });
    let drugs: [DrugEntity & { quantity: number }] = [] as any;
    for (const rackDrug of rackDrugs) {
      const drug = await this.drugService.getDrugById(rackDrug.drugId);
      drugs.push({ ...drug, quantity: rackDrug.quantity });
    }
    return drugs;
  }
}
