import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDrugTypeDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  name: string;
}

export class UpdateDrugTypeDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  name: string;
}
