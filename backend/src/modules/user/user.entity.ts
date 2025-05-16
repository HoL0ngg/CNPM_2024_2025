import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Unique(['username'])
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  status: string;

  @Column()
  name: string;
}
