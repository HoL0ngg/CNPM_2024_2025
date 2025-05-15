import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductToppingService } from './product_topping.service';

@Controller('product-topping')
export class ProductToppingController {
    constructor(
        private readonly productToppingService: ProductToppingService
    ) {}

    @Get()
    async getAll() {
        return {
            message: 'Toppings fetched successfully',
            data: await this.productToppingService.findAll(),
        }
    }

    @Post()
    async getByProduct(@Body() data: any) {
        return this.productToppingService.findToppingsByProductId(data.productId);
    }
}
