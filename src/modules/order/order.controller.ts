import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderRequestDto,
  ServeOrderRequestDto,
  UpdateOrderStatusRequestDto,
} from '../shared/dtos/order/request.dto';
import { CustomAuthGuard } from 'src/guards/custom-auth.guard';
import { EOrderStatus, ERole } from '../shared/constants';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('order')
@UseGuards(CustomAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/create')
  @UseGuards(new RoleGuard([ERole.CUSTOMER, ERole.STAFF]))
  async createOrder(@Body() reqBody: CreateOrderRequestDto) {
    return await this.orderService.create(reqBody);
  }

  @Get('/my-orders')
  @UseGuards(new RoleGuard([ERole.CUSTOMER]))
  async getMyOrders(@Req() req: any) {
    return await this.orderService.getMyOrders(req.user.id);
  }

  @Get('/splitted-orders')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getSplittedOrders(@Req() req: any) {
    return await this.orderService.getAllSplittedOrders(req.user.branchId);
  }

  @Get('/created-orders')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getCreatedOrders(@Req() req: any) {
    return await this.orderService.getAllCreatedOrders(req.user.branchId);
  }

  @Get('/approved-orders')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getApprovedOrders(@Req() req: any) {
    return await this.orderService.getAllApprovedOrders(req.user.branchId);
  }

  @Get('/delivered-orders')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getDeliveredOrders(@Req() req: any) {
    return await this.orderService.getAllDeliveredOrders(req.user.branchId);
  }

  @Get('/done-orders')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getDoneOrders(@Req() req: any) {
    return await this.orderService.getAllDoneOrders(req.user.branchId);
  }

  @Get('/rejected-orders')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getRejectedOrders(@Req() req: any) {
    return await this.orderService.getAllRejectedOrders(req.user.branchId);
  }

  @Get('/:id')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getOrderById(@Param('id') id: number) {
    return await this.orderService.getOrderById(id);
  }

  @Get('/:id/sub-orders')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async getSubOrdersOfId(@Param('id') id: number) {
    return await this.orderService.getAllSubOrdersOfId(id);
  }

  @Put('/:id')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() reqBody: UpdateOrderStatusRequestDto,
  ) {
    return await this.orderService.updateOrderStatus(id, reqBody);
  }

  @Post('/:id/split')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async splitOrder(
    @Param('id') id: number,
    @Body() reqBody: CreateOrderRequestDto[],
  ) {
    return await this.orderService.splitOrder(id, reqBody);
  }

  @Post('/:id/serve')
  @UseGuards(new RoleGuard([ERole.STAFF]))
  async serveOrder(
    @Param('id') id: number,
    @Body() reqBody: ServeOrderRequestDto[],
  ) {
    return await this.orderService.serveOrder(id, reqBody);
  }
}
