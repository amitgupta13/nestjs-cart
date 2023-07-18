import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { GetBooksDto } from './dtos/get-books.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Get()
  getBooks(@Query() query: GetBooksDto) {
    return this.bookService.getBooks(query);
  }
}
