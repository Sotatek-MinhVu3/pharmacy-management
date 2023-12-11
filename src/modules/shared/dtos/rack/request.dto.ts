import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRackDto {
  @IsNotEmpty()
  @IsInt()
  capacity: number;

  @IsNotEmpty()
  @IsInt()
  branchId?: number;
}

export class UpdateRackDto {
  capacity?: number;
  branchId?: number;
}

export class CreateRackDrugDto {
  @IsNotEmpty()
  @IsInt()
  rackId: number;

  @IsNotEmpty()
  @IsInt()
  drugId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

export class UpdateRackDrugDto {
  @IsNotEmpty()
  @IsInt()
  rackId: number;

  @IsNotEmpty()
  @IsInt()
  drugId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
