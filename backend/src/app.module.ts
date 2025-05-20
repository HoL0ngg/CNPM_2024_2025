import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { User} from './modules/user/user.entity';
import { Product } from './modules/product/product.entity';
import { Order } from './modules/order/order.entity';
import { Topping } from './modules/topping/topping.entity';
import { ProductTopping } from './modules/product_topping/product_topping.entity';
import { Customer } from './modules/customer/customer.entity';
import { DetailOrder } from './modules/detail-order/detail-order.entity';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './modules/order/order.module';
import { ToppingModule } from './modules/topping/topping.module';
import { ProductToppingModule } from './modules/product_topping/product_topping.module';
import { CustomerModule } from './modules/customer/customer.module';
import { DetailOrderModule } from './modules/detail-order/detail-order.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: '',
      database: 'orderfood',
      entities: [User, Product, Order, Topping, ProductTopping, Customer, DetailOrder], 
      synchronize: true,
    }),
    ServeStaticModule.forRoot(
      {
      rootPath: join(__dirname, '..', 'public', 'fe-customer', 'build'),  // Thư mục chứa các file tĩnh
      serveRoot: '/',
      },
      {
      rootPath: join(__dirname, '..', 'public', 'fe-admin', 'build'),  // Thư mục chứa các file tĩnh
      serveRoot: '/admin',
      },
      {
        rootPath: join(__dirname, '..', 'uploads'),  // Thư mục chứa các file tĩnh
        serveRoot: '/',
      },
    ),
    UserModule,
    ProductModule,
    OrderModule,
    ToppingModule,
    ProductToppingModule,
    CustomerModule,
    DetailOrderModule,
    AuthModule,
  ],
  controllers: [AppController],

})
export class AppModule {}
