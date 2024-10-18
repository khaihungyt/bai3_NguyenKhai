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

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail]),
  forwardRef(() => CartsModule), UsersModule, forwardRef(() => BooksModule),
    CategoriesModule, HttpModule,
  ConfigModule.forRoot()],
  controllers: [MoMoController],
  providers: [OrdersResolver, OrdersService, UsersService],
  exports: [OrdersService, TypeOrmModule]
})
export class OrdersModule { }
