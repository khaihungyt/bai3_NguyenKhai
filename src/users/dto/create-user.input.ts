import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString({ message: 'Username must be a string' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' }) 
  @IsNotEmpty({ message: 'Username is required' }) 
  username: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  @IsNotEmpty({ message: 'Password is required' }) 
  password: string;

  @Field()
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' }) 
  fullname: string;
}
