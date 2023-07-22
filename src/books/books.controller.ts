import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { GetBooksDto } from './dtos/get-books.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AddRatingDto } from './dtos/add-rating.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { GetRatingsDto } from './dtos/get-ratings.dto';

@ApiTags('Books')
@ApiHeader({
  name: 'x-auth-token',
})
@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Get()
  getBooks(@Query() query: GetBooksDto) {
    return this.bookService.getBooks(query);
  }

  @Get(':bookId/ratings')
  getRatings(@Param() params: GetRatingsDto) {
    return this.bookService.getRatings(params.bookId);
  }

  @Post('ratings')
  @UseGuards(AuthGuard)
  addRating(@Body() body: AddRatingDto, @CurrentUser() user) {
    return this.bookService.addRating(body, user);
  }

  @Get(':bookId/ratings/user')
  @UseGuards(AuthGuard)
  getUserRating(@Param('bookId') bookId: string, @CurrentUser() user) {
    return this.bookService.getUserRating(bookId, user);
  }
}
