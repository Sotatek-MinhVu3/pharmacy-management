import { ERackType } from 'src/modules/shared/constants';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'racks' })
export class RackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ERackType.BRANCH })
  type: ERackType;

  @Column()
  capacity: number;

  @Column({ name: 'branch_id' })
  branchId: number;
}
