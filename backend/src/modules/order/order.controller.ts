import { Body, Controller, Get, Post, Put } from '@nestjs/common';
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

    @Get()
    async getAll() {
        try {
            const orders = await this.orderService.getAll();
            return {
                message: 'Orders retrieved successfully',
                data: orders,
            };
        } catch (error) {
            return {
                message: 'Error retrieving orders',
                error: error.message,
            };
        }
    }

    @Put()
    async update(@Body() orderData: any) {
        try {
            const order = await this.orderService.update(orderData);
            return {
                message: 'Order updated successfully',
                data: order,
            };
        } catch (error) {
            return {
                message: 'Error updating order',
                error: error.message,
            };
        }
    }

    @Put('cancel')
    async cancel(@Body() orderData: any) {
        try {
            const order = await this.orderService.cancel(orderData);
            return {
                message: 'Order cancelled successfully',
                data: order,
            };
        } catch (error) {
            return {
                message: 'Error cancelling order',
                error: error.message,
            };
        }
    }
}
