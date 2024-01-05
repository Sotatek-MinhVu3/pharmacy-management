import { Exclude } from 'class-transformer';
import { EOrderStatus } from 'src/modules/shared/constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: EOrderStatus.CREATED })
  status: EOrderStatus;

  @Column({ name: 'branch_id' })
  branchId: number;

  @Column({ default: 0 })
  total: number;

  @Column({ name: 'is_splitted', default: false })
  isSplitted: boolean;

  @Column({ name: 'split_for', default: 0 })
  splitFor: number;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  deletedAt: Date;
}
