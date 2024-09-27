import { CreateCategoryInput } from './create-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field(() => String)
  categoryID: string;

  @Field(() => String)
  categoryName?: string;
  
  @Field(() => Boolean, { nullable: true })
  isHidden: boolean;
}
