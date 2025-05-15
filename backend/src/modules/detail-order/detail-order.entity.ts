import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn, Unique } from 'typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { Topping } from '../topping/topping.entity';

@Entity('detail_orders')
@Unique(['orderId', 'productId', 'toppingId'])
export class DetailOrder {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  productId: number;

  @PrimaryColumn()
  toppingId: number;

  @Column()
  quantityProduct: number;

  @Column()
  priceProduct: number;

  @Column()
  priceTopping: number;

  @ManyToOne(() => Order, (order) => order.detailOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.detailOrders,{ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Topping, (topping) => topping.detailOrders, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'toppingId' })
  topping: Topping;
}
