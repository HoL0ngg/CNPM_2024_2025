import { Module } from '@nestjs/common';
import { DetailOrderController } from './detail-order.controller';
import { DetailOrderService } from './detail-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailOrder } from './detail-order.entity'; // Import your entity here
import { OrderService } from '../order/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([DetailOrder])], // Add your entities here
  controllers: [DetailOrderController],
  providers: [DetailOrderService]
})
export class DetailOrderModule {}
