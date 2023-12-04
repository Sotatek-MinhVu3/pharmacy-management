import { Exclude } from 'class-transformer';
import { EUserStatus } from 'src/modules/shared/constants';
import { Entity, Column, PrimaryColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'customers' })
export class CustomerEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column()
  phone: string;

  @Column({
    default: EUserStatus.ACTIVE,
  })
  status: EUserStatus;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  deletedAt: Date;
}
