import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role-guard';
import { Role } from 'src/users/entities/user.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) { }

  @Mutation(() => Post)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  createPost(@Args('createPostInput') createPostInput: CreatePostInput, @Context("user") user: any) {
    return this.postsService.create(user.userID, createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('postid', { type: () => String }) id: string) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.postID, updatePostInput);
  }

  @Mutation(() => Post)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  removePost(@Args('id', { type: () => String }) id: string) {
    return this.postsService.remove(id);
  }
}
