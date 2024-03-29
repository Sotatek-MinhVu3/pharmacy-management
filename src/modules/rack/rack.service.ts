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
import { BranchService } from '../branch/branch.service';

@Injectable()
export class RackService {
  constructor(
    @InjectRepository(RackEntity)
    private readonly rackRepo: Repository<RackEntity>,

    @InjectRepository(RackDrugEntity)
    private readonly rackDrugRepo: Repository<RackDrugEntity>,

    private readonly drugService: DrugService,
    private readonly branchService: BranchService,
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
      const branch = await this.branchService.getBranchById(
        branchWarehouse.branchId,
      );
      res.push({
        drugs,
        branch,
        capacityUsed,
        capacity: branchWarehouse.capacity,
        rackId: branchWarehouse.id,
      });
    }
    return res;
  }

  async getRacksByBranchId(branchId: number) {
    const racks = await this.rackRepo.find({
      where: { type: ERackType.BRANCH, branchId },
    });
    if (!racks.length) return [];
    let res = [];
    for (const rack of racks) {
      let drugsWithQuantity = [];
      const drugs = await this.getAllDrugsOfRack(rack.id);
      for (const drug of drugs) {
        const rackDrug = await this.rackDrugRepo.findOneBy({
          rackId: rack.id,
          drugId: drug.id,
        });
        drugsWithQuantity.push({ ...drug, quantity: rackDrug.quantity });
      }
      const capacityUsed = await this.getCapacityUsed(rack.id);
      res.push({
        rackId: rack.id,
        drugs: drugsWithQuantity,
        capacityUsed,
        capacity: rack.capacity,
      });
    }
    return res;
  }

  async getRackById(id: number) {
    const rack = await this.rackRepo.findOneBy({ id });
    if (!rack) throw new NotFoundException('Rack not found.');
    const drugs = await this.getAllDrugsOfRack(rack.id);
    const capacityUsed = await this.getCapacityUsed(rack.id);
    return { ...rack, drugs, capacityUsed };
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
    const branchWarehouse = await this.rackRepo.findOneBy({
      type: ERackType.BRANCH_WAREHOUSE,
      branchId,
    });
    const drugsInBranchWarehouse = await this.rackDrugRepo.findOneBy({
      rackId: branchWarehouse.id,
      drugId: reqBody.drugId,
    });
    if (
      !drugsInBranchWarehouse ||
      drugsInBranchWarehouse.quantity < reqBody.quantity
    ) {
      throw new BadRequestException('Drugs left not enough or not found.');
    }
    await this.addDrugsToRack(reqBody);
    await this.removeDrugsFromRack({ ...reqBody, rackId: branchWarehouse.id });
    return 'Add drugs successful.';
  }

  async getBranchWarehouseByBranchId(branchId: number) {
    const branchWarehouse = await this.rackRepo.findOneBy({
      type: ERackType.BRANCH_WAREHOUSE,
      branchId,
    });
    if (!branchWarehouse)
      throw new NotFoundException('Branch warehouse not found.');
    const drugs = await this.getAllDrugsOfRack(branchWarehouse.id);
    const capacityUsed = await this.getCapacityUsed(branchWarehouse.id);
    return { ...branchWarehouse, capacityUsed, drugs };
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

  async removeDrugsFromBranchWarehouse(
    reqBody: UpdateRackDrugRequestDto,
    branchId: number,
  ) {
    const rack = await this.getRackById(reqBody.rackId);
    if (
      !(rack.type === ERackType.BRANCH_WAREHOUSE && rack.branchId === branchId)
    ) {
      throw new ForbiddenException('You cannot remove drugs from this rack.');
    }
    const drug = await this.drugService.getDrugById(reqBody.drugId);
    return await this.removeDrugsFromRack(reqBody);
  }

  async validateQuantityLeft(reqBody: UpdateRackDrugRequestDto) {
    const rackDrug = await this.rackDrugRepo.findOneBy({
      rackId: reqBody.rackId,
      drugId: reqBody.drugId,
    });
    if (!rackDrug) throw new BadRequestException('Rack drug not found.');
    if (reqBody.quantity > rackDrug.quantity)
      throw new BadRequestException('Quantity left not enough.');
  }

  async removeDrugsFromRack(reqBody: UpdateRackDrugRequestDto) {
    const rackDrug = await this.rackDrugRepo.findOneBy({
      rackId: reqBody.rackId,
      drugId: reqBody.drugId,
    });
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
