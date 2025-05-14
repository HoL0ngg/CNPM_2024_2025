import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { User} from './modules/user/user.entity';
import { Product } from './modules/product/product.entity';
import { Order } from './modules/order/order.entity';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: '',
      database: 'orderfood',
      entities: [User, Product, Order], 
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'build'),  // Thư mục chứa các file tĩnh
      serveRoot: '',
    }),
    UserModule,
    ProductModule,
    OrderModule,
  ],

})
export class AppModule {}
