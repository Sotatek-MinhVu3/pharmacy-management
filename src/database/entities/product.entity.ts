import { Exclude } from 'class-transformer';
import { EProductUnit } from 'src/modules/shared/constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'due_date' })
  dueDate: Date;

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
  unit: EProductUnit;

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
