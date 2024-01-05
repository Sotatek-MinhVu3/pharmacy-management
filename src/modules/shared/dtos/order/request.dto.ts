import { IsArray, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { EOrderStatus } from '../../constants';

export class DrugInOrder {
  @IsNotEmpty()
  @IsInt()
  drugId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

export class CreateOrderDrugsRequestDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsInt()
  drugId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

export class CreateOrderRequestDto {
  @IsNotEmpty()
  @IsInt()
  branchId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  splitFor: number;

  @IsNotEmpty()
  @IsArray()
  drugs: DrugInOrder[];
}

export class UpdateOrderStatusRequestDto {
  @IsNotEmpty()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;
}
