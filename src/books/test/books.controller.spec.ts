import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';
import { mockBooksService } from './mock';

describe('BooksController', () => {
  let controller: BooksController;
  let fakeBooksService: any;

  beforeEach(async () => {
    fakeBooksService = mockBooksService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: fakeBooksService,
        },
      ],
    }).compile();
    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch all books', async () => {
    const books = await controller.getBooks({});
    expect(books.data.length).toBe(2);
  });

  it('should get ratings for a book', async () => {
    const ratings = await controller.getRatings({ bookId: 'bookId' });
    expect(ratings.length).toBe(1);
  });

  it('should add rating to a book for a user', async () => {
    const rating = await controller.addRating(
      { book: 'bookId', rating: 5 },
      {},
    );
    expect(rating).toBeDefined();
  });

  it('should get rating for a particular user', async () => {
    const rating = await controller.getUserRating('bookId', {});
    expect(rating).toBeDefined();
  });
});
