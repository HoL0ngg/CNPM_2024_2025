import { Module } from '@nestjs/common';
import { ToppingController } from './topping.controller';
import { ToppingService } from './topping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topping } from './topping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topping])],
  controllers: [ToppingController],
  providers: [ToppingService]
})
export class ToppingModule {}
