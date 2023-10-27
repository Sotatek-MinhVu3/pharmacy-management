import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column()
  name: string;
}
