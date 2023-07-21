import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { BooksService } from '../books/books.service';
import { books } from './data';
import { BookInterface } from 'src/books/interfaces/book.interfaces';

@Injectable()
export class BookSeed {
  constructor(private readonly bookService: BooksService) {}

  @Command({ command: 'create:books', describe: 'create list of books' })
  async create() {
    const { data } = await this.bookService.getBooks({});
    if (data.length) return;
    await this.bookService.flushBooks();
    return this.bookService.addBooks(
      books.map((item) => ({
        _id: item._id.$oid,
        title: item.title,
        authors: item.authors,
        price: item.price,
        averageRating: 0,
        url: item.url,
      })) as BookInterface[],
    );
  }
}
