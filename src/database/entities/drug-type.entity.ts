import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'types' })
export class DrugTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;
}
