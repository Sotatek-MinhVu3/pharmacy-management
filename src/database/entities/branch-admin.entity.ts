import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'branch_admins' })
export class BranchAdminEntity {
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

  @Column({ name: 'branch_id' })
  branchId: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  deletedAt: Date;
}
