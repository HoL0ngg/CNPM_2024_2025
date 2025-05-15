import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetailOrder } from './detail-order.entity';


@Injectable()
export class DetailOrderService {
    constructor(
        @InjectRepository(DetailOrder)
        private readonly detailOrderRepository: Repository<DetailOrder>,
    ) {}

    create(detailOrder: DetailOrder): Promise<DetailOrder> {
        return this.detailOrderRepository.save(detailOrder);
    }

    getByOrderId(orderId: number): Promise<DetailOrder[]> {
        return this.detailOrderRepository.find({
            where: { orderId },
            relations: ['product', 'topping'],
        });
    }
}
