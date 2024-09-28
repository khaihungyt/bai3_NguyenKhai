import { Injectable } from '@nestjs/common';
import { CreateCartDetailInput } from './dto/create-cartDetail.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CartDetail } from './entities/cartdetail.entity';
import { BooksService } from 'src/books/books.service';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class CartsService {
  constructor(@InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail) private cartDetailRepository: Repository<CartDetail>, // Repository cho CartDetail
    private userSerVice: UsersService,
    private bookSerVice: BooksService) { }
  async create(userID: string, createCartDetailInput: CreateCartDetailInput) {
    const cart = await this.findOne(userID)
    const user = await this.userSerVice.findOne(userID);
    const bookFound = await this.bookSerVice.findOne(createCartDetailInput.BookID)
    if (cart) {
      let cartDetailFound = await this.cartDetailRepository.findOne({
        where: {
          cart: { cartID: cart.cartID },
          book: { bookID: bookFound.bookID }
        },
        relations: ['book', 'cart']
      });
      //console.log(cartDetailFound);
      if (!cartDetailFound) {
        await this.createCartDetail(createCartDetailInput, cart, bookFound);
      } else {
        await this.updateCartDetail(cartDetailFound.cartDetailID, createCartDetailInput.numberAdd);
      }
      return cart;
    } else {
      const newCart = this.cartRepository.create({
        user: user,
        cartDetails: [] // Gán người dùng cho giỏ hàng
      });
      await this.cartRepository.save(newCart);
      // Tạo chi tiết giỏ hàng mới
      const newCartDetail = await this.cartDetailRepository.create({
        quantity: createCartDetailInput.numberAdd,
        book: bookFound, // Tìm sách theo ID
        cart: newCart,  // Liên kết với giỏ hàng
      });
      // Lưu chi tiết giỏ hàng vào cơ sở dữ liệu
      await this.cartDetailRepository.save(newCartDetail);
      newCart.cartDetails.push(newCartDetail);
      return await this.cartRepository.save(newCart);
    }
  }
  async createCartDetail(createCartDetailInput: CreateCartDetailInput, cart: Cart, bookFound: Book) {
    const newCartDetail = await this.cartDetailRepository.create({
      quantity: createCartDetailInput.numberAdd,
      book: bookFound, // Tìm sách theo ID
      cart: cart,  // Liên kết với giỏ hàng
    });
    cart.dateAdd = new Date();
    await this.cartRepository.save(cart);
    await this.cartDetailRepository.save(newCartDetail);
  }
  //cai nay ko can 
  findAll() {
    return `This action returns all carts`;
  }

  async findOne(userID: string) {
    return await this.cartRepository.findOne({
      where: {
        user: { userID: userID },
      },
      relations: ['user', 'cartDetails'],
    })
  }
  async findOneCart(cartID: string) {
    return await this.cartRepository.findOne({
      where: {
        cartID: cartID
      },
      relations: ['user', 'cartDetails']
    })
  }
  //cai nay ko can
  update(id: string, updateCartInput: UpdateCartInput) {
    return `This action updates a #${id} cart`;
  }

  async remove(cartID: string) {
    const cartRemove = await this.findOneCart(cartID);
    await this.cartRepository.remove(cartRemove);
    return "delete suceess";
  }

  async removeCartDetail(cartDetailid: string) {
    const cartDetailRemove = await this.cartDetailRepository.findOne({
      where: {
        cartDetailID: cartDetailid
        
      }, relations: ['cart']
    })
    await this.cartDetailRepository.remove(cartDetailRemove);
    const remainingDetails = await this.cartDetailRepository.find({
      where: { cart: cartDetailRemove.cart }
    });
    if (remainingDetails.length === 0) {
      // Nếu không còn cartDetail nào, xóa Cart cha
      await this.remove(cartDetailRemove.cart.cartID);
    }
    return "remove success";
  }
  async updateCartDetail(cartDetailID: string, numberAdd: number) {
    let cartDetailFound = await this.cartDetailRepository.findOne({
      where: {
        cartDetailID: cartDetailID
      }
    })
    //cartDetailFound.cart.dateAdd = new Date();
    cartDetailFound.quantity = cartDetailFound.quantity + numberAdd;
    return await this.cartDetailRepository.save(cartDetailFound);
  }

}


