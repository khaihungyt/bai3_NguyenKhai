import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';
import { Collection, Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, Relation } from 'typeorm';
@Entity('category')
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  categoryID: string;

  @Column()
  @Field(() => String)
  categoryName: string;

  @Column({
    type: 'boolean',
    default: true,  // Thiết lập giá trị mặc định là true
  })
  @Field(() => Boolean, { nullable: true })
  isHidden: boolean;

  @ManyToMany(() => Book, (book) => book.category)
  @Field(() => [Book], { nullable: true })
  book?: Relation<Book[]>;
}
