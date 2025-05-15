import { Body, Controller, Post } from '@nestjs/common';
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
}
