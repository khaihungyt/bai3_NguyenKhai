import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Like, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private booksRepository: Repository<Book>,
    // @Inject(forwardRef(() => OrdersService)) private orderService: OrdersService,
    //private modulRef: ModuleRef,
    private CategoriesService: CategoriesService) { }
  async create(createBookInput: CreateBookInput) {
    let categories: Category[];
    if (createBookInput.categoriesID && createBookInput.categoriesID.length > 0) {
      categories = await this.CategoriesService.findSomeIds(createBookInput.categoriesID);
      // Kiểm tra xem số lượng categories tìm được có khớp với số ID được cung cấp không
      if (categories.length !== createBookInput.categoriesID.length) {
        throw new Error('Some categories were not found');
      }
    }
    const newBook = this.booksRepository.create(createBookInput);
    if (categories != null && categories.length > 0) {
      newBook.category = categories;
    }
    const savedBook = this.booksRepository.save(newBook);
    return savedBook;
  }

  async findAll(pageNumber: number, numberofAPage: number) {
    const skip = (pageNumber - 1) * numberofAPage; // Tính toán số bản ghi cần bỏ qua
    return await this.booksRepository.find({
      where: {
        isHidden: true
      },
      relations: ['category', 'orderdetails'],
      skip: skip, // Số bản ghi cần bỏ qua
      take: numberofAPage, // Số bản ghi cần lấy
    });
  }
  findSome(name: string) {
    this.booksRepository.find({
      where: {
        bookName: Like(`%${name}%`),
        isHidden: true,
      }
    });
  }
  findOne(id: string) {
    return this.booksRepository.findOne({
      where: {
        bookID: id,
        isHidden: true,
      }
    });
  }

  async update(id: string, updateBookInput: UpdateBookInput) {
    let book: Book = await this.findOne(id);
    if (updateBookInput.bookName) {
      book.bookName = updateBookInput.bookName;
    }
    if (updateBookInput.categoriesID && updateBookInput.categoriesID.length > 0) {
      let categoriesFound: Category[] = await this.CategoriesService.findSomeIds(updateBookInput.categoriesID);
      book.category = categoriesFound;
    }
    if (updateBookInput.isHidden) {
      book.isHidden = true;
    }
    if (updateBookInput.priceABook) {
      book.priceABook = updateBookInput.priceABook;
    }
    if (updateBookInput.bookNumber) {
      book.bookNumber = updateBookInput.bookNumber;
    }
    if (updateBookInput.author) {
      book.author = updateBookInput.author;
    }
    return this.booksRepository.save(book);
  }

  async remove(id: string) {
    let bookFound = await this.findOne(id);
    if (bookFound) {
      bookFound.isHidden = false;
    }
    return this.booksRepository.save(bookFound);
  }
  async updateBookNumber(bookid: string, bookNumber: number) {
    let book: Book = await this.findOne(bookid);
    if (bookNumber > 0) {
      book.bookNumber = bookNumber;
    }
    return await this.booksRepository.save(book);
  }
}
