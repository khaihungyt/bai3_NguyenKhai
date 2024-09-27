import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Extensions } from '@nestjs/graphql';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
  async create(createUserInput: CreateUserInput) {
    const userFound = await this.checklogin(createUserInput.username, createUserInput.password);
    if (userFound) {
      throw new Error('have a customer');
    } else {
      const newUser = await this.usersRepository.create(createUserInput);
      return this.usersRepository.save(newUser);
    }
  }

  findAll() {
    return this.usersRepository.find({
      where: {
        isHidden: true,
      },
      relations: ['posts', 'orders', 'cart', 'comments']
    });
  }

  findOne(id: string) {
    return this.usersRepository.findOne({
      where: {
        isHidden: true,
        userID: id
      },
      relations: ['posts', 'orders', 'cart', 'comments']
    })
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    let userUpdate = await this.findOne(id);
    if (updateUserInput.fullname) {
      userUpdate.fullname = updateUserInput.fullname;
    }
    if (updateUserInput.password) {
      userUpdate.password = updateUserInput.password;
    }
    if (updateUserInput.username) {
      userUpdate.username = updateUserInput.username;
    }
    if (updateUserInput.isHidden) {
      userUpdate.isHidden = true;
    }
    return this.usersRepository.save(userUpdate);
  }

  async remove(id: string) {
    let userRemove = await this.findOne(id);
    if (userRemove) {
      userRemove.isHidden = false;
    }
    return this.usersRepository.save(userRemove);
  }

  async checklogin(username: string, password: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username,
        password: password
      }
    })
  }

}
