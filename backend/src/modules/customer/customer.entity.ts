import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}