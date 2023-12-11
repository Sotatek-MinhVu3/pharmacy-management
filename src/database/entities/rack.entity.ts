import { ERackType } from 'src/modules/shared/constants';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'racks' })
export class RackEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column()
  type: ERackType;

  @Column({
    name: 'branch_id',
    nullable: true,
  })
  branchId: number;

  @Column()
  capacity: number;
}
