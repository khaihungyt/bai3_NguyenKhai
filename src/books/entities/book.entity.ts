import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { CartDetail } from 'src/carts/entities/cartdetail.entity';
import { Category } from 'src/categories/entities/category.entity';
import { OrderDetail } from 'src/orders/entities/orderdetail.entity';
import { Column, Double, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
@Entity('book')
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  bookID: string;
  @Column()
  @Field(() => String)
  bookName: string;
  @Column()
  @Field(() => String)
  author: string;

  @Column()
  @Field(() => Int)
  bookNumber: number;

  @Column('float')
  @Field(() => Float)
  priceABook: number;

  @Column({
    type: 'boolean',
    default: true,  // Thiết lập giá trị mặc định là true
  })
  @Field(() => Boolean, { nullable: true })
  isHidden: boolean;

  @ManyToMany(() => Category, (category) => category.book)
  @JoinTable()
  @Field(() => [Category], { nullable: true })
  category: Relation<Category[]>;
  @OneToMany(() => OrderDetail, (orderdetail) => orderdetail.book)
  @Field(() => [OrderDetail], { nullable: true })
  orderdetails: Relation<OrderDetail[]>;
  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.book)
  @Field(() => [CartDetail], { nullable: true })
  cartDetails: Relation<CartDetail[]>;
}
