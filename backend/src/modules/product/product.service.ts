import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductTopping } from '../product_topping/product_topping.entity';

@Injectable()
export class ProductService {
    constructor(
         @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductTopping)
        private readonly productToppingRepository: Repository<ProductTopping>,

        private readonly dataSource: DataSource,
    ) {}

    findAll(): Promise<Product[]> {
        return this.productRepository.find({
            relations: ['productToppings', 'productToppings.topping'],
        });
    }

    findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOneBy({ id });
    }

    async create(data: any): Promise<boolean> {
        console.log('Data received:', JSON.stringify(data, null, 2));
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            // Lưu sản phẩm
            const newProduct = transactionalEntityManager.create(Product, data.product);
            const savedProduct = await transactionalEntityManager.save(Product, newProduct);

            let productToppingsToSave: ProductTopping[] = [];
            if(data.productTopping.toppings.length !== 0) {
                for (const item of data.productTopping.toppings) {           
                    productToppingsToSave.push(
                        transactionalEntityManager.create(ProductTopping, {
                            product: savedProduct,
                            toppingId: item,
                        })
                    );
                }
            }
            if(productToppingsToSave.length > 0) {
                await transactionalEntityManager.save(ProductTopping, productToppingsToSave);
            }

        });
        return true;
    }

    async update(data: any): Promise<boolean> {
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            // Cập nhật sản phẩm
            const updatedProduct = transactionalEntityManager.create(Product, data.product);
            await transactionalEntityManager.update(Product, { id: data.product.id }, updatedProduct);

            // Xóa các topping cũ
            await transactionalEntityManager.delete(ProductTopping, { productId: data.product.id });

            // Lưu các topping mới
            let productToppingsToSave: ProductTopping[] = [];
            for (const item of data.productTopping.toppings) {
                productToppingsToSave.push(
                    transactionalEntityManager.create(ProductTopping, {
                        productId: data.id,
                        toppingId: item,
                    })
                );
            }
            await transactionalEntityManager.save(ProductTopping, productToppingsToSave);
        });
        return true;
    }

    remove(id: number): Promise<void> {
        return this.productRepository.delete(id).then(() => {});
    }
}
