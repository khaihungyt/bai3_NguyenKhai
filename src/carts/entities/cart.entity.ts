import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { CartDetail } from './cartdetail.entity';


@Entity('cart')
@ObjectType()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  cartID: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  dateAdd: Date;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.cart, { cascade: true })
  @Field(() => [CartDetail])
  cartDetails: Relation<CartDetail[]>;
}
