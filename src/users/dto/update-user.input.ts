import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  userID: string;

  @Field()
  @IsString({ message: 'Username must be a string' }) // Kiểm tra kiểu string
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' }) // Kiểm tra độ dài
  @IsNotEmpty({ message: 'Username is required' }) // Trường này bắt buộc
  username: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  @IsNotEmpty({ message: 'Password is required' }) // Trường này bắt buộc
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  fullname?: string;

  @Field(() => Boolean, { nullable: true })
  isHidden: boolean;
}
