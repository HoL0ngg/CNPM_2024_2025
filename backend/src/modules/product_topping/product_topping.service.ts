import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTopping } from './product_topping.entity';

@Injectable()
export class ProductToppingService {
    constructor(
        @InjectRepository(ProductTopping)
        private readonly productToppingRepository: Repository<ProductTopping>,
    ) {}

    findAll(): Promise<ProductTopping[]> {
        return this.productToppingRepository.find();
    }

    async findToppingsByProductId(productId: number): Promise<ProductTopping[]> {
        return this.productToppingRepository.find({
        where: { productId },
        relations: ['topping', 'product'],
        });
    }
}
