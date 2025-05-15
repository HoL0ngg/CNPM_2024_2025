import { Module } from '@nestjs/common';
import { ProductToppingController } from './product_topping.controller';
import { ProductToppingService } from './product_topping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTopping } from './product_topping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTopping])],
  controllers: [ProductToppingController],
  providers: [ProductToppingService]
})
export class ProductToppingModule {}
