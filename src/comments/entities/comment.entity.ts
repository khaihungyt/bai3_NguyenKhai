import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
@Entity('comment')
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  commentID: string;

  @Column()
  @Field(() => String)
  description: string;



  @ManyToOne(() => User, user => user.comments)
  @Field(() => User)
  user: Relation<User>;

  @ManyToOne(() => Post, post => post.comment)
  @Field(() => Post)
  post: Relation<Post>;
}
