import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  postID: string;
  @Field(() => String)
  description: string;
}
