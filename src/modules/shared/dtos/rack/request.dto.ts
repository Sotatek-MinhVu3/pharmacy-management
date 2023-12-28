import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRackRequestDto {
  @IsNotEmpty()
  @IsInt()
  capacity: number;
}

export class CreateRackDrugRequestDto {
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

export class UpdateRackDrugRequestDto {
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

export class UpdateRackRequestDto {
  @IsNotEmpty()
  @IsInt()
  rackId: number;

  @IsNotEmpty()
  @IsInt()
  capacity: number;
}
