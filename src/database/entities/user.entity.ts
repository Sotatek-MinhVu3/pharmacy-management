import { Exclude } from 'class-transformer';
import { ERole } from 'src/modules/shared/constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    default: ERole.USER,
  })
  role: ERole;

  @Column({
    nullable: true,
    name: 'branch_id',
  })
  branchId: number;

  @Column()
  phone: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  deletedAt: Date;
}