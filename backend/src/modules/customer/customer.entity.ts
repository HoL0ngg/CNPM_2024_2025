import { Entity, Column, OneToMany, PrimaryColumn} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('customers')
export class Customer {
  @PrimaryColumn()
  phone: string;

  @Column()
  name: string;
  
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}