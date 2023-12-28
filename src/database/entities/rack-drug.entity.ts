import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'rack_drugs' })
export class RackDrugEntity {
  @PrimaryColumn({ name: 'rack_id' })
  rackId: number;

  @PrimaryColumn({ name: 'drug_id' })
  drugId: number;

  @Column()
  quantity: number;
}
