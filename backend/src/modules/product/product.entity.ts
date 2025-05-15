// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { ProductTopping } from '../product_topping/product_topping.entity';
import { DetailOrder } from '../detail-order/detail-order.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  categoryId: string;

  @Column()
  quantity: number;

  @Column()
  image: string;

  @OneToMany(() => ProductTopping, (pt) => pt.product)
  productToppings: ProductTopping[];

  @OneToMany(() => DetailOrder, (detailOrder) => detailOrder.product)
  detailOrders: DetailOrder[];

}
