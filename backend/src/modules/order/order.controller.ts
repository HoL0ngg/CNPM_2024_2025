import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}
    
    @Post()
    async create(@Body() orderData: any) {
        try {
            const order = await this.orderService.create(orderData);
            return {
                message: 'Order created successfully',
                data: order,
            };
        } catch (error) {
            return {
                message: 'Error creating order',
                error: error.message,
            };
        }
    }
}
