import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique} from 'typeorm';
import { Product } from '../product/product.entity';
import { ProductTopping } from '../product_topping/product_topping.entity';
import { DetailOrder } from '../detail-order/detail-order.entity';

@Entity('toppings')
export class Topping {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    price: number;
    
    @Column()
    image: string;

    @OneToMany(() => ProductTopping, (pt) => pt.topping)
    productToppings: ProductTopping[];

    @OneToMany(() => DetailOrder, (detailOrder) => detailOrder.topping)
    detailOrders: DetailOrder[];

}
