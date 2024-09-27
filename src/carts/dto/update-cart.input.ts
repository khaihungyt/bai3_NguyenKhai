import { CreateCartDetailInput } from './create-cartDetail.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput extends PartialType(CreateCartDetailInput) {
  @Field(() => String)
  id: string;
}
