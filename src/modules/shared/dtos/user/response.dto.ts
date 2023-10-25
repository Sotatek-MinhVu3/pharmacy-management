import { Expose } from 'class-transformer';
import { EUserStatus } from '../../constants';

export class GetProfileDto {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  branchId: number;

  @Expose()
  status: EUserStatus;
}
