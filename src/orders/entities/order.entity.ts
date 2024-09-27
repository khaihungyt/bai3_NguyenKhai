import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Double, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { OrderDetail } from './orderdetail.entity';
@Entity('order')
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  orderID: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  dateAdd: Date;

  @Column()
  @Field(() => String)
  status: string;

  @ManyToOne(() => User, (user) => user.orders)
  @Field(() => User)
  user: Relation<User>;
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  @Field(() => [OrderDetail])
  orderDetails: Relation<OrderDetail[]>;
}
