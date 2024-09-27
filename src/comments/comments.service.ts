import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private userService: UsersService,
    private postService: PostsService) { }
  async create(userID: string, createCommentInput: CreateCommentInput) {
    const userFound: User = await this.userService.findOne(userID);
    const postFound: Post = await this.postService.findOne(createCommentInput.postID);
    let newComment = await this.commentRepository.create({
      description: createCommentInput.description,
      user: userFound,
      post: postFound,
    })
    return await this.commentRepository.save(newComment);
  }

  async findAll() {
    return await this.commentRepository.find({
      relations: ['user', 'post']
    });
  }

  async findOne(commentid: string) {
    return await this.commentRepository.findOne({
      where: {
        commentID: commentid
      }, relations: ['user', 'post']
    });
  }

  async update(commentid: string, updateCommentInput: UpdateCommentInput) {
    let commentFound = await this.findOne(commentid);
    if (updateCommentInput.description) {
      commentFound.description = updateCommentInput.description
    }
    return await this.commentRepository.save(commentFound);
  }

  async remove(commentid: string) {
    let commentFound = await this.findOne(commentid);
    if (commentFound) {
      await this.commentRepository.remove(commentFound);
      return "remove comment success";
    }
    else {
      return "remove comment fail";
    }
  }
}
