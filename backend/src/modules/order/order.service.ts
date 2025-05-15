import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './order.entity';
import { DetailOrder } from '../detail-order/detail-order.entity';
import { Customer } from '../customer/customer.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(DetailOrder)
        private readonly detailOrderRepository: Repository<DetailOrder>,
        
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,

        private dataSource: DataSource,
    ) {}

    async create(data: any): Promise<boolean> {
        // Start a transaction
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            // 1. Create and save the customer
            const customer = transactionalEntityManager.create(Customer, data.customer);
            const savedCustomer = await transactionalEntityManager.save(Customer, customer);

            // 2. Create and save the order
            const orderInfo = {
                customerId: savedCustomer.id,
                totalPrice: data.totalPrice,
                status: 'Chờ xử lý', // hoặc giá trị mặc định khác
            };
            
            const order = transactionalEntityManager.create(Order, orderInfo);
            const savedOrder = await transactionalEntityManager.save(Order, order);

            const detailOrdersToSave: DetailOrder[] = [];
            
            for (const item of data.detailOrder) {
                if (!item.toppings || item.toppings.length === 0) {
                    detailOrdersToSave.push(
                        transactionalEntityManager.create(DetailOrder, {
                            order: savedOrder,
                            productId: item.id,
                            toppingId: 0,
                            quantityProduct: item.quantity,
                            priceProduct: item.price,
                            priceTopping: 0,
                        })
                    );
                } else {
                    for (const topping of item.toppings) {
                        detailOrdersToSave.push(
                            transactionalEntityManager.create(DetailOrder, {
                                order: savedOrder,
                                productId: item.id,
                                toppingId: topping.id,
                                quantityProduct: item.quantity,
                                priceProduct: item.price,
                                priceTopping: topping.price,
                            })
                        );
                    }
                }
            }
            await transactionalEntityManager.save(DetailOrder, detailOrdersToSave);
        });
        return true;
    }
}
