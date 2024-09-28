import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/role-guard';
import { Role } from 'src/users/entities/user.entity';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Mutation(() => Category)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput): Promise<string | Category> {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(@Args('pageNumber', { type: () => Int }) pageNumber: number,
  @Args('numberofAPage', { type: () => Int }) numberofAPage: number) {
    return this.categoriesService.findAll(pageNumber, numberofAPage);
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => Category)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  updateCategory(@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput) {
    return this.categoriesService.update(updateCategoryInput.categoryID, updateCategoryInput);
  }

  @Mutation(() => Category)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  removeCategory(@Args('id', { type: () => String }) id: string) {
    return this.categoriesService.remove(id);
  }
}
