import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CartsModule } from 'src/carts/carts.module';
import { CartsService } from 'src/carts/carts.service';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrderDetail } from './entities/orderdetail.entity';
import { UsersService } from 'src/users/users.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MoMoController } from './momo.controller';
import { BooksService } from 'src/books/books.service';
import { OrdersController } from './orders.controller';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@nestjs-modules/ioredis';
import { createClient } from '@redis/client';
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail],
  ), forwardRef(() => CartsModule), UsersModule, forwardRef(() => BooksModule),
    CategoriesModule, HttpModule,
  ConfigModule.forRoot(),
  // BullModule.forRoot({
  //   redis: {
  //     host: 'localhost',
  //     port: 3000,
  //   },
  // }),
  // BullModule.registerQueue({
  //   name: 'order-queue',
  // }),
  RedisModule.forRoot({
    type: 'single',
    url: 'redis://:123@redis-15027.c241.us-east-1-4.ec2.redns.redis-cloud.com:15027',
  }),
  ],
  controllers: [MoMoController, OrdersController],
  providers: [
    // {
    //   provide: 'REDIS_OPTIONS',
    //   useValue: {
    //     url: 'redis://localhost:6379'
    //   }
    // },
    // {
    //   inject: ['REDIS_OPTIONS'],
    //   provide: 'REDIS_CLIENT',
    //   useFactory: async (options: { url: string }) => {
    //     const client = createClient(options);
    //     await client.connect();
    //     return client;
    //   }
    // },
    OrdersResolver, OrdersService, UsersService],
  exports: [OrdersService, TypeOrmModule
    //, 'REDIS_CLIENT'
  ]
})
export class OrdersModule { }
