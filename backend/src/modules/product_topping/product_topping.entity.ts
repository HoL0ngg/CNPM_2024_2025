import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { Topping } from '../topping/topping.entity';

@Entity('product_toppings')
export class ProductTopping {
  @PrimaryColumn()
  productId: number;

  @PrimaryColumn()
  toppingId: number;

  @ManyToOne(() => Product, (product) => product.productToppings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Topping, (topping) => topping.productToppings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toppingId' })
  topping: Topping;
}
