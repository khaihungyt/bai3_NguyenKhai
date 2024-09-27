import { CreateOrderInput } from './create-order.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

// Định nghĩa enum cho order status
export enum OrderStatus {
  PENDING = 'pending',
  DELIVERING = 'delivering',
  APPROVED = 'approved',
  CANCEL = 'cancel',
}
@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field(() => String)
  orderID: string;

  @Field(() => String)
  @IsEnum(OrderStatus, { message: 'orderStatus must be one of: pending, delivering, approved, cancel' }) // Sử dụng class-validator
  orderStatus: OrderStatus;
}
