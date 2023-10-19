import { Expose } from 'class-transformer';

export class GetProfileDto {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;
}
