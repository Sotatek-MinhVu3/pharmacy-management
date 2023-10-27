import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductTypeDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  name: string;
}

export class UpdateProductTypeDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  name: string;
}
