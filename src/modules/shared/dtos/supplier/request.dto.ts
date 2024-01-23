import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  img: string;
}

export class UpdateSupplierDto {
  name: string;

  @IsEmail()
  email: string;

  phone: string;
  img: string;
}
