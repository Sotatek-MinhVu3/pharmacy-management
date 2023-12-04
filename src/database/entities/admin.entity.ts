import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'admins' })
export class AdminEntity {
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
}
