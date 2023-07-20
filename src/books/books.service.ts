import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument, Rating, RatingDocument } from './schemas';
import { Model } from 'mongoose';
import { BookInterface } from './interfaces/book.interfaces';
import { SharedService } from 'src/shared/shared.service';
import { AddRatingDto } from './dtos/add-rating.dto';

@Injectable()
export class BooksService {
  constructor(
    private sharedService: SharedService,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
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

  getRatings(book: string) {
    return this.ratingModel.find({ book });
  }

  async addRating(body: AddRatingDto, user) {
    const rating = await this.ratingModel.findOne({
      book: body.book,
      user: user._id,
    });

    if (rating) {
      rating.rating = body.rating;
      return rating.save();
    }

    return this.ratingModel.create(
      new this.ratingModel({
        ...body,
        user: user._id,
      }),
    );
  }

  getUserRating(book: string, user) {
    return this.ratingModel.findOne({ book, user: user._id });
  }
}
