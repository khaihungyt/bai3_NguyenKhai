import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Role } from 'src/users/entities/user.entity';
import { RoleGuard } from 'src/auth/role-guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) { }

  @Mutation(() => Book)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
  findAll(@Args('pageNumber', { type: () => Int }) pageNumber: number,
    @Args('numberofAPage', { type: () => Int }) numberofAPage: number) {
    return this.booksService.findAll(pageNumber, numberofAPage);
  }
  @Query(() => [Book], { name: 'somebooks' })
  findSome(@Args('name', { type: () => String }) name: string) {
    return this.booksService.findSome(name);
  }

  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.booksService.findOne(id);
  }

  @Mutation(() => Book)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.booksService.update(updateBookInput.bookID, updateBookInput);
  }

  @Mutation(() => Book)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  removeBook(@Args('id', { type: () => String }) id: string) {
    return this.booksService.remove(id);
  }
}
