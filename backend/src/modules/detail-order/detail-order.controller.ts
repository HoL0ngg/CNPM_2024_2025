import { Body, Controller, Post } from '@nestjs/common';
import { DetailOrderService } from './detail-order.service';

@Controller('detail-order')
export class DetailOrderController {
    constructor(
        private readonly detailOrderService: DetailOrderService
    ) {}

    @Post()
    async create(@Body() detailOrderData: any) {
        try {
            const detailOrder = await this.detailOrderService.create(detailOrderData);
            return {
                message: 'Detail order created successfully',
                data: detailOrder,
            };
        } catch (error) {
            return {
                message: 'Error creating detail order',
                error: error.message,
            };
        }
    }

    @Post('/id')
    async getByOrderId(@Body('orderId') orderId: number) {
        try {
            const detailOrders = await this.detailOrderService.getByOrderId(orderId);
            return {
                message: 'Detail orders fetched successfully',
                data: detailOrders,
            };
        } catch (error) {
            return {
                message: 'Error fetching detail orders',
                error: error.message,
            };
        }
    }
}
