import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Order } from './order.entity';
@Entity('order_detail')
@ObjectType()
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    orderdetailID: string;

    @Column()
    @Field(() => Int)
    quantity: number;

    @Column('float')
    @Field(() => Float)
    costABook: number;

    @ManyToOne(() => Book, book => book.orderdetails)
    @Field(() => Book)
    book: Relation<Book>;

    @ManyToOne(() => Order, order => order.orderDetails)
    @Field(() => Order)
    order: Relation<Order>;
}
