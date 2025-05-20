import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService
    ) {}

    @Post()
    async create(@Body() customerData: any) {
        try {
            const customer = await this.customerService.create(customerData);
            return {
                message: 'Customer created successfully',
                data: customer,
            };
        } catch (error) {
            return {
                message: 'Error creating customer',
                error: error.message,
            };
        }
    }

    @Get()
    async findAll() {
        try {
            const customers = await this.customerService.findAll();
            return {
                message: 'Customers fetched successfully',
                data: customers,
            };
        } catch (error) {
            return {
                message: 'Error fetching customers',
                error: error.message,
            };
        }
    }

    @Post('total-orders')
    async getTotalOrders(@Body() data: any) {
        try {
            const totalOrders = await this.customerService.getTotalOrders(data.phone);
            console.log(totalOrders);
            return {
                message: 'Total orders fetched successfully',
                data: totalOrders,
            };
            
        } catch (error) {
            return {
                message: 'Error fetching total orders',
                error: error.message,
            };
        }
    }

    @Post('total-spent')
    async getTotalSpent(@Body() data: any) {
        try {
            const totalSpent = await this.customerService.getTotalSpent(data.phone);
            return {
                message: 'Total spent fetched successfully',
                data: totalSpent,
            };
        } catch (error) {
            return {
                message: 'Error fetching total spent',
                error: error.message,
            };
        }
    }

    @Post('orders')
    async getOrdersByPhone(@Body() data: any) {
        try {
            const orders = await this.customerService.getOrdersByPhone(data.phone);
            return {
                message: 'Orders fetched successfully',
                data: orders,
            };
        } catch (error) {
            return {
                message: 'Error fetching orders',
                error: error.message,
            };
        }
    }
}
