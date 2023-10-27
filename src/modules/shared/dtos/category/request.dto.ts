import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateCategoryDto {
  @IsNotEmpty()
  name: string;
}
