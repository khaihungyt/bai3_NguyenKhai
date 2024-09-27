import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  cartID: string;
  @Field(() => String)
  address: string;
}
