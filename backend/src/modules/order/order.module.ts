import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DetailOrder } from '../detail-order/detail-order.entity';
import { Customer } from '../customer/customer.entity';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, DetailOrder, Customer, Product])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
