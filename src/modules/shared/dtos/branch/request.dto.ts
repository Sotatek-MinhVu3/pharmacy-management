import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;
}

export class UpdateBranchDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;
}
