import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { ERole } from '../shared/constants';
import { RoleGuard } from 'src/guards/role.guard';
import { BranchService } from '../branch/branch.service';

@Controller('insight')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class InsightController {
  constructor(
    private orderService: OrderService,
    private branchService: BranchService,
  ) {}

  @Get('/my-branch/orders')
  @UseGuards(new RoleGuard([ERole.BRANCH_ADMIN]))
  async getMyOrdersStats(@Req() req: any) {
    const [
      createdOrders,
      approvedOrders,
      deliveredOrders,
      doneOrders,
      rejectedOrders,
      subOrders,
    ] = await Promise.all([
      this.orderService.getAllCreatedOrders(req.user.branchId),
      this.orderService.getAllApprovedOrders(req.user.branchId),
      this.orderService.getAllDeliveredOrders(req.user.branchId),
      this.orderService.getAllDoneOrders(req.user.branchId),
      this.orderService.getAllRejectedOrders(req.user.branchId),
      this.orderService.getAllSubOrders(req.user.branchId),
    ]);
    return [
      { created: createdOrders.length },
      { approved: approvedOrders.length },
      { delivered: deliveredOrders.length },
      { done: doneOrders.length },
      { rejected: rejectedOrders.length },
      { splitted: subOrders.length },
    ];
  }

  @Get('branches/sales')
  @UseGuards(new RoleGuard([ERole.ADMIN]))
  async getBranchesSales() {
    const branches = await this.branchService.getAllBranches();
    let res = [];
    for (const branch of branches) {
      let total = 0;
      const doneOrders = await this.orderService.getAllDoneOrders(branch.id);
      doneOrders.forEach((order) => (total += order.total));
      res.push({ branchId: branch.id, branchName: branch.name, total });
    }
    return res;
  }
}
