import { Exclude } from 'class-transformer';
import { EDrugUnit } from 'src/modules/shared/constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'drugs' })
export class DrugEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    name: 'type_id',
  })
  typeId: number;

  @Column({ name: 'supplier_id' })
  supplierId: number;

  @Column({ name: 'sold_as_dose' })
  soldAsDose: boolean;

  @Column({ name: 'sensitive_ingredients', nullable: true })
  sensitiveIngredients: string;

  @Column()
  description: string;

  @Column()
  unit: EDrugUnit;

  @Column()
  barcode: number;

  @Column()
  price: number;

  @Column()
  size: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  deletedAt: Date;
}
