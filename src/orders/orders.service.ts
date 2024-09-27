import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CartsService } from 'src/carts/carts.service';
import { Cart } from 'src/carts/entities/cart.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
    private cartService: CartsService,
    private userService: UsersService) { }
  async create(createOrderInput: CreateOrderInput) {
    let cartFound: Cart = await this.cartService.findOneCart(createOrderInput.cartID);
    const newOrder = await this.orderRepository.create({
      address: createOrderInput.address,
      status: "pending",
      user: cartFound.user,
      orderDetails: []
    })
    await this.orderRepository.save(newOrder);
    let cartDetails = cartFound.cartDetails;
    // Tạo và lưu các orderDetails
    let orderDetailPromises = cartDetails.map(async cartDetail => {
      let orderDetail: OrderDetail = this.orderDetailRepository.create({
        book: cartDetail.book,
        quantity: cartDetail.quantity,
        costABook: cartDetail.book.priceABook,
        order: newOrder  // Liên kết OrderDetail với Order đã lưu
      });
      let savedorderDetail = await this.orderDetailRepository.save(orderDetail);
      return savedorderDetail;
    });
    let orderDetails = await Promise.all(orderDetailPromises);
    newOrder.orderDetails = orderDetails;
    return await this.orderRepository.save(newOrder);
  }

  async findAll() {
    return await this.orderRepository.find({ relations: ['user', 'orderDetails'] });
  }

  async findOneUser(userID: string) {
    return await this.orderRepository.find({
      where: {
        user: await this.userService.findOne(userID)
      }, relations: ['user', 'orderDetails']
    })
  }

  async findOne(orderID: string) {
    return await this.orderRepository.findOne({
      where: {
        orderID: orderID
      }, relations: ['user', 'orderDetails']
    })
  }
  async update(orderid: string, updateOrderInput: UpdateOrderInput) {
    let orderFound = await this.findOne(orderid);
    if (orderFound) {
      orderFound.status = updateOrderInput.orderStatus;
    }
    return await this.orderRepository.save(orderFound);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
