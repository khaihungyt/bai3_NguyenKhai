import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderABookInput {
    @Field(() => String)
    bookID: string;
    @Field(() => Int)
    numberbookbuy: number;
    @Field(() => String)
    address: string;
}
