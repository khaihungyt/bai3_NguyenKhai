import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => String)
  commentid: string;
  @Field(() => String)
  description: string;
}
