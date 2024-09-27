import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Role } from 'src/users/entities/user.entity';
import { RoleGuard } from 'src/auth/role-guard';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) { }
  @Mutation(() => Order)
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.ordersService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Query(() => [Order], { name: 'someorderuser' })
  @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
  findOneUser(@Args('userid', { type: () => String }) id: string) {
    return this.ordersService.findOneUser(id);
  }

  @Mutation(() => Order)
  @UseGuards(JwtGuard, new RoleGuard(Role.ADMIN))
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.update(updateOrderInput.orderID, updateOrderInput);
  }

  // @Mutation(() => Order)
  // removeOrder(@Args('id', { type: () => Int }) id: number) {
  //   return this.ordersService.remove(id);
  // }
}
