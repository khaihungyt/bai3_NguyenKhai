import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Cart } from 'src/carts/entities/cart.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, Relation } from 'typeorm';

// Định nghĩa enum cho role
export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

// Đăng ký enum với GraphQL
registerEnumType(Role, {
  name: 'Role',
  description: 'The role of the account',
});
@Entity('user')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userID: string;

  @Column()
  @Field({ nullable: true })
  username?: string;

  @Column()
  password?: string;

  @Column()
  @Field({ nullable: true })
  fullname?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,  // Default value
  })
  @Field(() => Role, { nullable: true })
  role?: Role;

  @Column({
    type: 'boolean',
    default: true,  // Thiết lập giá trị mặc định là true
  })
  @Field(() => Boolean, { nullable: true })
  isHidden: boolean;

  @OneToMany(() => Post, (post) => post.user)
  @Field(() => [Post], { nullable: true })
  posts: Relation<Post[]>;

  @OneToMany(() => Order, (order) => order.user)
  @Field(() => [Order], { nullable: true })
  orders: Relation<Order[]>;

  @OneToOne(() => Cart, (cart) => cart.user)
  @Field(() => Cart, { nullable: true })
  cart: Relation<Cart>;

  @OneToMany(() => Comment, (comment) => comment.user)
  @Field(() => [Comment])
  comments: Relation<Comment[]>;
}

