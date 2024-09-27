import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CreateCartDetailInput } from './dto/create-cartDetail.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role-guard';
import { Role } from 'src/users/entities/user.entity';

@Resolver(() => Cart)
export class CartsResolver {
  constructor(private readonly cartsService: CartsService) { }

  @Mutation(() => Cart)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  createCart(@Args('cartDetailInput') createCartDetailInput: CreateCartDetailInput, @Context("user") user: any) {
    return this.cartsService.create(user.userID, createCartDetailInput);
  }

  // @Query(() => [Cart], { name: 'carts' })
  // findAll() {
  //   return this.cartsService.findAll();
  // }

  @Query(() => Cart, { name: 'cart' })
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.cartsService.findOne(id);
  }

  @Mutation(() => Cart)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  updateCart(@Args('updateCartInput') updateCartInput: UpdateCartInput) {
    return this.cartsService.update(updateCartInput.id, updateCartInput);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  removeCart(@Args('cartID', { type: () => String }) id: string): Promise<string> {
    return this.cartsService.remove(id);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  removeCartDetail(@Args('CartDetailID', { type: () => String }) id: string): Promise<string> {
    return this.cartsService.removeCartDetail(id);
  }


}
