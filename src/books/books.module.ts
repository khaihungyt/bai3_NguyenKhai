import { forwardRef, Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrdersModule } from 'src/orders/orders.module';
import { CartsModule } from 'src/carts/carts.module';
import { OrdersService } from 'src/orders/orders.service';
import { CartsService } from 'src/carts/carts.service';
import { Cart } from 'src/carts/entities/cart.entity';
import { CartDetail } from 'src/carts/entities/cartdetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book]),
    CategoriesModule, forwardRef(() => OrdersModule),
  forwardRef(() => CartsModule)],

  providers: [BooksResolver, BooksService, CategoriesService],
  exports: [BooksService, TypeOrmModule]
})
export class BooksModule { }
