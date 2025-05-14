import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    constructor(
         @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOneBy({ id });
    }

    create(product: Product): Promise<Product> {
        return this.productRepository.save(product);
    }

    update(id: number, product: Product): Promise<Product> {
        return this.productRepository.save({ ...product, id });
    }

    remove(id: number): Promise<void> {
        return this.productRepository.delete(id).then(() => {});
    }
}
