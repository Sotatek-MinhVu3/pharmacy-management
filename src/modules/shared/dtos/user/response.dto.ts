import { Expose } from 'class-transformer';
import { ERole, EUserStatus } from '../../constants';

export class GetProfileDto {
  @Expose()
  userId: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  branchId?: number;

  @Expose()
  status?: EUserStatus;
}

export class GetUserFromRequestDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: ERole;

  @Expose()
  branchId?: number;

  @Expose()
  status?: EUserStatus;
}
