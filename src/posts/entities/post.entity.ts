import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
@Entity('post')
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  postID: string;

  @Column()
  @Field(() => String)
  title: string;
  @Column()
  @Field(() => String)
  description: string;
  @Column({
    type: 'boolean',
    default: true,  // Thiết lập giá trị mặc định là true
  })
  @Field(() => Boolean, { nullable: true })
  isHidden: boolean;



  @ManyToOne(() => User, (user) => user.posts)
  @Field(() => User)
  user: Relation<User>;

  @OneToMany(() => Comment, (comment) => comment.post)
  @Field(() => [Comment])
  comment: Relation<Comment[]>;

}
