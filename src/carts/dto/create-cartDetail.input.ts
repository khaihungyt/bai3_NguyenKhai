import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCartDetailInput {
  @Field(() => String)
  BookID: string;

  @Field(() => Int)
  numberAdd: number
}
