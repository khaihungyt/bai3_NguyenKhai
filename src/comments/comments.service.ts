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

  async findOneCommentOfUser(commentid: string, user: User) {
    return await this.commentRepository.findOne({
      where: {
        commentID: commentid,
        user: await user
      }, relations: ['user', 'post']
    });
  }



  async update(userID: string, commentid: string, updateCommentInput: UpdateCommentInput) {
    let userFound = await this.userService.findOne(userID);
    let commentFound = await this.findOneCommentOfUser(commentid, userFound);
    if (commentFound) {
      if (updateCommentInput.description) {
        commentFound.description = updateCommentInput.description
      }
      return await this.commentRepository.save(commentFound);
    } else {
      throw new Error("not found");
    }
  }

  async remove(userID: string, commentid: string) {
    let userFound = await this.userService.findOne(userID);
    let commentFound = await this.findOneCommentOfUser(commentid, userFound);
    
    if (commentFound) {
      await this.commentRepository.remove(commentFound);
      return "remove comment success";
    }
    else {
      return "remove comment fail";
    }
  }
}
