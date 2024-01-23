import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDrugEntity } from 'src/database/entities/order-drug.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MoreThan, Repository } from 'typeorm';
import {
  CreateOrderRequestDto,
  DrugInOrder,
  ServeOrderRequestDto,
  UpdateOrderStatusRequestDto,
} from '../shared/dtos/order/request.dto';
import { DrugService } from '../drug/drug.service';
import { EOrderStatus } from '../shared/constants';
import { RackService } from '../rack/rack.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    @InjectRepository(OrderDrugEntity)
    private readonly orderDrugRepo: Repository<OrderDrugEntity>,
    private readonly drugService: DrugService,
    private readonly rackService: RackService,
  ) {}

  async create(reqBody: CreateOrderRequestDto) {
    const newOrder = await this.orderRepo.save({
      branchId: reqBody.branchId,
      userId: reqBody.userId,
      splitFor: reqBody.splitFor ?? 0,
    } as OrderEntity);
    const orderDrugs = reqBody.drugs.map((od) => ({
      orderId: newOrder.id,
      ...od,
    }));
    let total = 0;
    for (const orderDrug of orderDrugs) {
      const drug = await this.drugService.getDrugById(orderDrug.drugId);
      total += drug.price * orderDrug.quantity;
      await this.orderDrugRepo.save(orderDrug);
    }
    return await this.orderRepo.save({ ...newOrder, total });
  }

  async updateOrderStatus(id: number, reqBody: UpdateOrderStatusRequestDto) {
    const order = await this.getOrderById(id);
    const updatedOrder = await this.orderRepo.save({ ...order, ...reqBody });
    if (reqBody.status === EOrderStatus.DONE) {
      if (order.splitFor) {
        const subOrders = await this.getAllSubOrdersOfId(order.splitFor);
        if (subOrders.every((sp) => sp.status === EOrderStatus.DONE)) {
          await this.orderRepo.update(
            { id: order.splitFor },
            { status: EOrderStatus.DONE },
          );
        }
      }
    }
    return updatedOrder;
  }

  async getAllCreatedOrders(branchId: number) {
    const splittedOrders = await this.orderRepo.find({
      where: { branchId, status: EOrderStatus.CREATED },
    });
    let res = [];
    for (const splittedOrder of splittedOrders) {
      const orderWithDrug = await this.getOrderById(splittedOrder.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getAllSplittedOrders(branchId: number) {
    const splittedOrders = await this.orderRepo.find({
      where: { branchId, isSplitted: true },
    });
    let res = [];
    for (const splittedOrder of splittedOrders) {
      const orderWithDrug = await this.getOrderById(splittedOrder.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getAllSubOrders(branchId: number) {
    const splittedOrders = await this.orderRepo.find({
      where: { branchId, splitFor: MoreThan(0) },
    });
    let res = [];
    for (const splittedOrder of splittedOrders) {
      const orderWithDrug = await this.getOrderById(splittedOrder.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getAllApprovedOrders(branchId: number) {
    const approvedOrders = await this.orderRepo.find({
      where: { branchId, status: EOrderStatus.APPROVED },
    });
    let res = [];
    for (const order of approvedOrders) {
      const orderWithDrug = await this.getOrderById(order.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getAllDoneOrders(branchId: number) {
    const doneOrders = await this.orderRepo.find({
      where: { branchId, status: EOrderStatus.DONE },
    });
    let res = [];
    for (const order of doneOrders) {
      const orderWithDrug = await this.getOrderById(order.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getAllDeliveredOrders(branchId: number) {
    const deliveredOrder = await this.orderRepo.find({
      where: { branchId, status: EOrderStatus.DELIVERED },
    });
    let res = [];
    for (const order of deliveredOrder) {
      const orderWithDrug = await this.getOrderById(order.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getAllRejectedOrders(branchId: number) {
    const rejectedOrders = await this.orderRepo.find({
      where: { branchId, status: EOrderStatus.REJECTED },
    });
    let res = [];
    for (const order of rejectedOrders) {
      const orderWithDrug = await this.getOrderById(order.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getMyOrders(userId: number) {
    const myOrders = await this.orderRepo.findBy({ userId, splitFor: 0 });
    let res = [];
    for (const order of myOrders) {
      const orderWithDrug = await this.getOrderById(order.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getAllSubOrdersOfId(id: number) {
    const subOrders = await this.orderRepo.find({
      where: { splitFor: id },
    });
    let res = [];
    for (const subOrder of subOrders) {
      const orderWithDrug = await this.getOrderById(subOrder.id);
      res.push(orderWithDrug);
    }
    return res;
  }

  async getOrderDrugsByOrderId(orderId: number) {
    const orderDrugs = await this.orderDrugRepo.find({ where: { orderId } });
    if (!orderDrugs.length) {
      return [];
    }
    return orderDrugs;
  }

  async getOrderById(id: number) {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) {
      throw new BadRequestException('Order not found.');
    }
    const drugsWithQuantity = await this.getOrderDrugsByOrderId(id);
    return { ...order, drugsWithQuantity };
  }

  async splitOrder(id: number, reqBody: CreateOrderRequestDto[]) {
    const order = await this.getOrderById(id);
    this.validateSplitOrder(order.drugsWithQuantity, reqBody);
    await this.validateSubOrders(reqBody);
    await this.orderRepo.update(id, { isSplitted: true });
    let splittedOrders = [];
    for (const createOrderRequest of reqBody) {
      const splittedOrder = await this.create({
        ...createOrderRequest,
        splitFor: Number(id),
      });
      splittedOrders.push(splittedOrder);
    }
    return { parentOrderId: Number(id), splittedOrders };
  }

  async serveOrder(id: number, reqBody: ServeOrderRequestDto[]) {
    //Validate quantity left
    for (const serveOrderReq of reqBody) {
      await this.rackService.validateQuantityLeft(serveOrderReq);
    }
    //Update
    for (const serveOrderReq of reqBody) {
      await this.rackService.removeDrugsFromRack(serveOrderReq);
    }
    return await this.updateOrderStatus(id, { status: EOrderStatus.DELIVERED });
  }

  private validateSplitOrder(
    drugs: DrugInOrder[],
    reqBody: CreateOrderRequestDto[],
  ) {
    for (const drug of drugs) {
      let quantity = 0;
      reqBody.filter((order) => {
        if (order.drugs.some((item) => item.drugId === drug.drugId)) {
          const foundItem = order.drugs.find(
            (item) => item.drugId === drug.drugId,
          );
          quantity += foundItem.quantity;
          return foundItem;
        }
      });
      if (quantity !== drug.quantity) {
        throw new BadRequestException(
          'Drugs in splitted order does not match drugs in parent order.',
        );
      }
    }
  }

  private async validateSubOrders(reqBody: CreateOrderRequestDto[]) {
    for (const subOrder of reqBody) {
      const branchRacks = await this.rackService.getRacksByBranchId(
        subOrder.branchId,
      );
      for (const drugOfOrder of subOrder.drugs) {
        let validDrugs = [];
        branchRacks.forEach((rack) =>
          validDrugs.push(
            rack.drugs.filter((drug) => drug.drugId === drugOfOrder.drugId),
          ),
        );
        if (!validDrugs.length) {
          throw new BadRequestException(
            `Branch with id ${subOrder.branchId} does not have drug with id ${drugOfOrder.drugId} now.`,
          );
        }
        let quantityOfBranch = 0;
        validDrugs.forEach((drug) => (quantityOfBranch += drug.quantity));
        if (quantityOfBranch < drugOfOrder.quantity) {
          throw new BadRequestException(
            `Branch with id ${subOrder.branchId} does not have enough drugs to provide.`,
          );
        }
      }
    }
  }
}
