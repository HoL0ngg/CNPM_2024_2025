import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './order.entity';
import { DetailOrder } from '../detail-order/detail-order.entity';
import { Customer } from '../customer/customer.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(DetailOrder)
        private readonly detailOrderRepository: Repository<DetailOrder>,
        
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        private dataSource: DataSource,
    ) {}

    async create(data: any): Promise<boolean> {
        //Sài transaction
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            let existingCustomer = await transactionalEntityManager.findOne(Customer, {
                where: { phone: data.customer.phone },
            });
            if(!existingCustomer) {
                existingCustomer = transactionalEntityManager.create(Customer, data.customer);
                existingCustomer= await transactionalEntityManager.save(Customer, existingCustomer);
            }
            const orderInfo = {
                customerPhone: existingCustomer.phone,
                totalPrice: data.order.totalPrice,
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

    async getAll(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: {
                customer: true,
                detailOrders: {
                    product: true,
                    topping: true,
                },
            },
        });
    }

    async update(data: any): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id: data.id } });
        if (!order) {
            throw new Error('Order not found');
        }
        if(order.status === "Chờ xử lý") {
            order.status = "Đang nấu";
            const detailOrders = await this.detailOrderRepository.find({ where: { orderId: order.id } });
            for (const detailOrder of detailOrders) {
                const product = await this.productRepository.findOne({ where: { id: detailOrder.productId } });
                if (product) {
                    product.quantity -= detailOrder.quantityProduct;
                    await this.productRepository.save(product);
                }
                const topping = await this.productRepository.findOne({ where: { id: detailOrder.toppingId } });
                if (topping) {
                    topping.quantity -= 1;
                    await this.productRepository.save(topping);
                }
            }
        }
        else if(order.status === "Đang nấu") {
            order.status = "Đã hoàn thành";
        }

        order.updated_at = new Date();
        return this.orderRepository.save(order);
    }

    async cancel(data: any): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id: data.id } });
        if (!order) {
            throw new Error('Order not found');
        }
        if(order.status === "Chờ xử lý") {
            order.status = "Đã hủy";
        }
        else if(order.status === "Đang nấu") {
            order.status = "Đã hủy";
            const detailOrders = await this.detailOrderRepository.find({ where: { orderId: order.id } });
            for (const detailOrder of detailOrders) {
                const product = await this.productRepository.findOne({ where: { id: detailOrder.productId } });
                if (product) {
                    product.quantity += detailOrder.quantityProduct;
                    await this.productRepository.save(product);
                }
                const topping = await this.productRepository.findOne({ where: { id: detailOrder.toppingId } });
                if (topping) {
                    topping.quantity += 1;
                    await this.productRepository.save(topping);
                }
            }
        }
        order.updated_at = new Date();
        return this.orderRepository.save(order);
    }
}
