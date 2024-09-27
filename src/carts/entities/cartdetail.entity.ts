import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Cart } from './cart.entity';
import { Column, Double, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';

@Entity('cart_detail')
@ObjectType()
export class CartDetail {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    cartDetailID: string;

    @Column()
    @Field(() => Int)
    quantity: number;

    @ManyToOne(() => Book, (book) => book.cartDetails, { eager: true })
    @Field(() => Book)
    book: Relation<Book>;

    @ManyToOne(() => Cart, (cart) => cart.cartDetails, { onDelete: 'CASCADE' })
    @Field(() => Cart)
    cart: Relation<Cart>;
}
