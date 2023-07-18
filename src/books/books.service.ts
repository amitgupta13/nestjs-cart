import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas';
import { Model } from 'mongoose';
import { BookInterface } from './interfaces/book.interfaces';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class BooksService {
  constructor(
    private sharedService: SharedService,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  addBooks(books: BookInterface[]) {
    const bookDocuments = books.map((book) => new this.bookModel(book));
    return this.bookModel.bulkSave(bookDocuments);
  }

  flushBooks() {
    return this.bookModel.deleteMany({});
  }

  async getBooks(requestQuery) {
    return this.sharedService.advancedResults(requestQuery, this.bookModel);
  }
}
