import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role-guard';
import { Role } from 'src/users/entities/user.entity';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) { }

  @Mutation(() => Comment)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  createComment(@Args('createCommentInput') createCommentInput: CreateCommentInput, @Context("user") user: any) {
    return this.commentsService.create(user.userID, createCommentInput);
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('commentid', { type: () => String }) id: string) {
    return this.commentsService.findOne(id);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  updateComment(@Args('updateCommentInput') updateCommentInput: UpdateCommentInput) {
    return this.commentsService.update(updateCommentInput.commentid, updateCommentInput);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  removeComment(@Args('commentid', { type: () => String }) id: string): Promise<string> {
    return this.commentsService.remove(id);
  }
}
