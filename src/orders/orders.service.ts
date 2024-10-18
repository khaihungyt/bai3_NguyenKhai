import { forwardRef, Inject, Injectable, Req } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CartsService } from 'src/carts/carts.service';
import { Cart } from 'src/carts/entities/cart.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BooksService } from 'src/books/books.service';
import { Book } from 'src/books/entities/book.entity';
import { CreateOrderABookInput } from './dto/create-orderabook.input';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
    @Inject(forwardRef(() => CartsService)) private cartService: CartsService,
    private userService: UsersService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject(forwardRef(() => BooksService)) private bookService: BooksService) { }
  async create(createOrderInput: CreateOrderInput) {
    let cartFound: Cart = await this.cartService.findOneCart(createOrderInput.cartID);
    let cartDetails = cartFound.cartDetails;
    let totalcost: number = 0;
    await cartDetails.forEach(item => {
      if (item.quantity > item.book.bookNumber) {
        throw new Error("so sach trong cart nhieu hon so sach trong kho");
      }
      totalcost += item.book.priceABook * item.quantity;
    })
    let result1 = await this.payment(totalcost);
    console.log(result1);
    if (result1.resultCode === 0) {
      await this.updateBookRespository(cartFound);
      const newOrder = await this.orderRepository.create({
        address: createOrderInput.address,
        status: "pending",
        user: cartFound.user,
        orderDetails: []
      })
      await this.orderRepository.save(newOrder);
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
    else {
      throw new Error(result1.message);
    }
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
  async payment(totalcost: number) {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:3000/graphql';
    var ipnUrl = 'https://kind-beers-grin.loca.lt/momo';
    var requestType = "payWithMethod";
    var amount = Math.round(totalcost) * 10000;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    var signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature
    });
    try {
      const response = await this.httpService.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).toPromise();
      return response.data;
    } catch (error) {
      console.error('Error with MoMo payment:', error.response?.data || error.message);
      throw new Error('Payment failed');
    }
  }

  // Hàm xác thực chữ ký
  verifySignature(data: any, signature: string): boolean {
    const rawData = `accessKey=F8BBA842ECF85&orderId=${data.orderId}&partnerCode=MOMO&requestId=${data.orderId}`; // tùy chỉnh dựa trên các tham số MoMo gửi
    const hash = crypto.createHmac('sha256', 'K951B6PE1waDMi640xX08PD3vg6EkVlz').update(rawData).digest('hex');
    return hash === signature;
  }

  // Xử lý IPN
  async processIPN(ipnData: any) {
    const { signature, ...data } = ipnData;

    if (!this.verifySignature(data, signature)) {
      throw new Error('Invalid signature');
    }
    // Xử lý logic cập nhật trạng thái đơn hàng
    // Ví dụ: Lưu thông tin giao dịch, cập nhật trạng thái thanh toán
    const orderId = data.orderId;
    const resultCode = data.resultCode;
    if (resultCode === 0) {
      // Thanh toán thành công
      console.log(`Payment for order ${orderId} is successful.`);
      // Cập nhật trạng thái đơn hàng trong database
    } else {
      // Thanh toán thất bại
      console.log(`Payment for order ${orderId} failed with result code: ${resultCode}`);
    }
    // Trả về phản hồi thành công cho MoMo
    return { status: 'success' };
  }


  // async checkStatusPayment(result1: any) {
  //   // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
  //   // &requestId=$requestId
  //   var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  //   var accessKey = 'F8BBA842ECF85';
  //   const rawSignature = `accessKey=${accessKey}&orderId=${result1.orderId}&partnerCode=MOMO&requestId=${result1.orderId}`;

  //   const signature = crypto
  //     .createHmac('sha256', secretKey)
  //     .update(rawSignature)
  //     .digest('hex');

  //   const requestBody = JSON.stringify({
  //     partnerCode: 'MOMO',
  //     requestId: result1.orderId,
  //     orderId: result1.orderId,
  //     signature: signature,
  //     lang: 'vi',
  //   });

  //   // options for axios
  //   const options = {
  //     method: 'POST',
  //     url: 'https://test-payment.momo.vn/v2/gateway/api/query',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: requestBody,
  //   };

  //   const result = await axios(options);
  //   return result.data;
  // }

  async updateBookRespository(cartFound: Cart) {
    cartFound.cartDetails.forEach(async element => {
      let quantityBookUpdate: number = element.book.bookNumber - element.quantity;
      await this.bookService.updateBookNumber(element.book.bookID, quantityBookUpdate);
    });
  }
  async createOrderABook(CreateOrderABookInput: CreateOrderABookInput, userID: string) {
    const bookFound: Book = await this.bookService.findOne(CreateOrderABookInput.bookID);
    const userFound: User = await this.userService.findOne(userID);
    let quantityBookUpdate: number = bookFound.bookNumber - CreateOrderABookInput.numberbookbuy;
    if (quantityBookUpdate < 0) {
      throw new Error("sai so luong sach");
    }
    let result1 = await this.payment(bookFound.priceABook * CreateOrderABookInput.numberbookbuy);
    if (result1.resultCode === 0) {
      await this.bookService.updateBookNumber(CreateOrderABookInput.bookID, quantityBookUpdate);
      const newOrder = await this.orderRepository.create({
        address: CreateOrderABookInput.address,
        status: "pending",
        user: userFound,
        orderDetails: []
      })
      await this.orderRepository.save(newOrder);

      let orderDetail: OrderDetail = this.orderDetailRepository.create({
        book: bookFound,
        quantity: CreateOrderABookInput.numberbookbuy,
        costABook: bookFound.priceABook,
        order: newOrder  // Liên kết OrderDetail với Order đã lưu
      });
      await this.orderDetailRepository.save(orderDetail);
      newOrder.orderDetails = [orderDetail];
      return await this.orderRepository.save(newOrder);
    } else {
      throw new Error(result1.message);
    }
  }

}
