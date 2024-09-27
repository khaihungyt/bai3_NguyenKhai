import { CreatePostInput } from './create-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => String)
  postID: string;
  @Field(() => String)
  title: string;
  @Field(() => String)
  description: string;
}
