import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Role, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import * as jwt from "jsonwebtoken";
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role-guard';
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  findAll(@Args('pageNumber', { type: () => Int }) pageNumber: number,
    @Args('numberofAPage', { type: () => Int }) numberofAPage: number) {
    return this.usersService.findAll(pageNumber, numberofAPage);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.userID, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }
  @Query(returns => String)
  @UseGuards(AuthGuard)
  login(@Args({ name: "username", type: () => String }) username: string,
    @Args({ name: "password", type: () => String }) password: string,
    @Context("user") user: User): any {
    let payload = {
      userID: user.userID,
      fullname: user.fullname,
      username: user.username,
      role: user.role,
      ishidden: user.isHidden
    }
    return jwt.sign(payload, "Khaideptrai1972", { expiresIn: "600s" });
  }

  @Query(returns => String)
  @UseGuards(JwtGuard)
  securedResource(@Context("user") user: any): string {
    return "this is secured data" + JSON.stringify(user);
  }
}
