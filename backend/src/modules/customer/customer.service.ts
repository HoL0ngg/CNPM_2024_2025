import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';
import { Order } from '../order/order.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
    ) {}

    create(customer: Customer): Promise<Customer> {
        return this.customerRepository.save(customer);
    }

    findAll(): Promise<Customer[]> {
        return this.customerRepository.find();
    }

    async getTotalOrders(data: any): Promise<number> {
        const result = await this.customerRepository
            .createQueryBuilder('customer')
            .innerJoin('customer.orders', 'order')
            .where('customer.phone = :phone', { phone: data })
            .andWhere('order.status = :status', { status: 'Đã hoàn thành' })
            .select('COUNT(order.id)', 'count')
            .getRawOne();

        return Number(result.count) || 0;
    }

    async getTotalSpent(data: any): Promise<number> {
        const result = await this.customerRepository
            .createQueryBuilder('customer')
            .leftJoin('customer.orders', 'order')
            .select('SUM(order.totalPrice)', 'total')
            .where('customer.phone = :phone', { phone: data })
            .andWhere('order.status NOT IN (:...excludedStatuses)', {
                excludedStatuses: ['Chờ xử lý', 'Đã hủy'],
            })
            .getRawOne();

        return Number(result.total) || 0;    
    }

    async getOrdersByPhone(data: any): Promise<Order[]> {
        return this.customerRepository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.orders', 'order')
            .where('customer.phone = :phone', { phone: data })
            .getMany()
            .then(customers => {
                if (customers.length > 0) {
                    return customers[0].orders;
                } else {
                    return [];
                }
            });
    }

}
