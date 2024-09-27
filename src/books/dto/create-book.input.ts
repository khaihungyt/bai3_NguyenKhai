import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  @Field(() => String)
  bookName: string;
  @Field(() => String)
  author: string;
  @Field(() => Int)
  bookNumber: number;

  @Field(() => Float)
  priceABook: number;

  @Field(() => [String], { nullable: true })
  categoriesID?: string[];

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isHidden?: boolean;
}
