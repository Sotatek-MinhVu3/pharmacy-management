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
import { EDrugUnit } from '../../constants';

export class CreateDrugDto {
  @IsNotEmpty()
  name: string;

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
  @IsEnum(EDrugUnit)
  unit: EDrugUnit;

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

export class UpdateDrugDto {
  name?: string;

  @IsInt()
  @IsPositive()
  typeId?: number;

  @IsInt()
  @IsPositive()
  supplierId?: number;

  soldAsDose?: boolean;

  sensitiveIngredients?: Array<string>;

  description?: string;

  @IsEnum(EDrugUnit)
  unit?: EDrugUnit;

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
