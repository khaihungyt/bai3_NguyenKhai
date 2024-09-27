import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsResolver } from './carts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { CartDetail } from './entities/cartdetail.entity';
import { BooksModule } from 'src/books/books.module';
import { BooksService } from 'src/books/books.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartDetail]), UsersModule, BooksModule, CategoriesModule],
  providers: [CartsResolver, CartsService, UsersService, BooksService],
  exports: [CartsService, TypeOrmModule]
})
export class CartsModule { }
