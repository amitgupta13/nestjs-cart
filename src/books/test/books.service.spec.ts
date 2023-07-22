import { Model } from 'mongoose';
import { BooksService } from '../books.service';
import { BookDocument, RatingDocument, Book, Rating } from '../schemas';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SharedService } from '../../shared/shared.service';
import {
  mockBooks,
  MockBookModel,
  MockRatingModel,
  mockPaginatedData,
} from './mock';

describe('BooksService', () => {
  let service: BooksService;
  let fakeSharedService: Partial<SharedService>;
  let fakeBookModel: jest.Mocked<Model<BookDocument>>;
  let fakeRatingModel: jest.Mocked<Model<RatingDocument>>;

  beforeEach(async () => {
    fakeSharedService = {
      advancedResults: async () => mockPaginatedData,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: MockBookModel,
        },
        {
          provide: getModelToken(Rating.name),
          useValue: MockRatingModel,
        },
        {
          provide: SharedService,
          useValue: fakeSharedService,
        },
      ],
    }).compile();

    service = module.get(BooksService);
    fakeBookModel = module.get(getModelToken(Book.name));
    fakeRatingModel = module.get(getModelToken(Rating.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add book data', async () => {
    const books: any = await service.addBooks(mockBooks);
    expect(books.length).toBe(2);
  });

  it('should flush books data', async () => {
    const books: any = await service.flushBooks();
    expect(books.length).toBe(0);
  });

  it('should get list of books', async () => {
    const books: any = await service.getBooks({});
    expect(books.data.length).toBe(2);
  });

  it('should get ratings of a book', async () => {
    const ratings: any = await service.getRatings('bookid');
    expect(ratings.length).toBe(1);
  });

  it('should add ratings for a book', async () => {
    const rating: any = await service.addRating(
      { book: 'bookId', rating: 5 },
      {},
    );
    expect(rating).toBeDefined();
  });

  it('should get users rating', async () => {
    const rating: any = await service.getUserRating('bookId', {});
    expect(rating).toBeDefined();
  });
});
