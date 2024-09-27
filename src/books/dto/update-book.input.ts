import { Category } from 'src/categories/entities/category.entity';
import { CreateBookInput } from './create-book.input';
import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field(() => String)
  bookID: string;

  @Field(() => String)
  bookName: string;
  @Field(() => String)
  author: string;
  @Field(() => Int)
  bookNumber: number;

  @Field(() => Float)
  priceABook: number;

  @Field(() => [String], { nullable: true })
  categories: string[];
  
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isHidden?: boolean;

}
