import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRespository: Repository<Post>,
    private userService: UsersService) { }
  async create(userID: string, createPostInput: CreatePostInput) {
    const userFound: User = await this.userService.findOne(userID);
    let newPost = await this.postRespository.create({
      title: createPostInput.title,
      description: createPostInput.description,
      user: userFound
    });
    return await this.postRespository.save(newPost);
  }

  async findAll() {
    return await this.postRespository.find({
      where: {
        isHidden: true
      },
      relations: ['user', 'comment']
    })
  }

  async findOne(postid: string) {
    return await this.postRespository.findOne({
      where: {
        postID: postid,
        isHidden: true,
      },
      relations: ['user', 'comment']
    })
  }

  async update(postid: string, updatePostInput: UpdatePostInput) {
    let postFound = await this.findOne(postid);
    if (updatePostInput.title) {
      postFound.title = updatePostInput.title;
    }
    if (updatePostInput.description) {
      postFound.description = updatePostInput.description;
    }
    return await this.postRespository.save(postFound);
  }

  async remove(postid: string) {
    let postFound = await this.findOne(postid);
    postFound.isHidden = false;
    return await this.postRespository.save(postFound);
  }
}
