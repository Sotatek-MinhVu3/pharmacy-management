import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { EProductUnit } from '../../constants';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  dueDate: Date;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  typeId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  supplierId: number;

  @IsBoolean()
  soldAsDose: boolean;

  sensitiveIngredients?: Array<string>;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(EProductUnit)
  unit: EProductUnit;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  barcode: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  size: number;
}

export class UpdateProductDto {
  name?: string;

  dueDate?: Date;

  @IsInt()
  @IsPositive()
  typeId?: number;

  @IsInt()
  @IsPositive()
  supplierId?: number;

  soldAsDose?: boolean;

  sensitiveIngredients?: Array<string>;

  description?: string;

  @IsEnum(EProductUnit)
  unit?: EProductUnit;

  @IsInt()
  @IsPositive()
  barcode?: number;

  @IsInt()
  @IsPositive()
  size?: number;

  @IsInt()
  @IsPositive()
  price?: number;
}
