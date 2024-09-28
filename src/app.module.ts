import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CartsModule } from './carts/carts.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { OrdersModule } from './orders/orders.module';
import { Book } from './books/entities/book.entity';
import { Order } from './orders/entities/order.entity';
import { Cart } from './carts/entities/cart.entity';
import { CartDetail } from './carts/entities/cartdetail.entity';
import { OrderDetail } from './orders/entities/orderdetail.entity';
import { Category } from './categories/entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot(),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), process.env.GRAPHQL_SCHEMA_PATH),
    playground: true,  // Bật giao diện playground
    context: ({ req }) => ({ req }),
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get<string>('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USER'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
      entities: [User, Book, Post, Comment, Category, Cart, Order, OrderDetail, CartDetail],
      autoLoadEntities: true,
      synchronize: false,
    }),
  }), UsersModule, BooksModule, PostsModule, CartsModule, CategoriesModule, CommentsModule, AuthModule, OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
