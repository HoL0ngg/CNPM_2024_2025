import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Get()
    async findAll() {
        try {
            const products = await this.productService.findAll();
            return {
                message: 'Products fetched successfully',
                data: products,
            };
        } catch (error) {
            return {
                message: 'Error fetching products',
                error: error.message,
            };
        }
    } 

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.productService.findOne(id);
    }
}
