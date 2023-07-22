import { BookInterface } from '../interfaces/book.interfaces';

export class MockBookModel {
  static books = [];

  static find = jest.fn();

  static bulkSave = function (b) {
    this.books.push(...b);
    return this.books;
  };
  static deleteMany = function () {
    this.books = [];
    return this.books;
  };
}

const ratings = [
  {
    _id: '64b994425d04ea5e48f7dac7',
    rating: 4,
    book: '64b65b4682d839401f527fa7',
    user: '6426b423be4101869c9fdc92',
    createdAt: '2023-07-20T20:08:34.356Z',
    updatedAt: '2023-07-20T20:08:46.010Z',
    __v: 0,
  },
];

export class MockRatingModel {
  static find = function () {
    return ratings;
  };

  static findOne = function () {
    return {
      ...ratings[0],
      save: () => ratings[0],
    };
  };

  static create = function () {
    return ratings[0];
  };
}

export const mockBooks: BookInterface[] = [
  {
    _id: { $oid: '64b65b4682d839401f527fa7' },
    title: 'Things Fall Apart',
    price: 61,
    authors: ['Angelo Johnson', 'Anna Murray', 'Mr. Eric Larkin'],
    averageRating: 1,
    url: 'https://robohash.org/0',
  },
  {
    _id: { $oid: '64b65b4682d839401f527fa8' },
    title: 'Fairy tales',
    price: 144,
    authors: ['Barry Sauer', 'Timothy Swaniawski-Franecki III', 'Bradley Rice'],
    averageRating: 1,
    url: 'https://robohash.org/1',
  },
];

export const mockPaginatedData = {
  totalCount: 100,
  currentPage: 1,
  limit: 2,
  success: true,
  count: 2,
  pagination: {
    next: {
      page: 2,
      limit: 2,
    },
  },
  data: [
    {
      _id: '64b65b4682d839401f527fd0',
      title: 'Hunger',
      url: 'https://robohash.org/41',
      price: 890,
      authors: ['Jasmine Hilll', 'Yvonne Jones', 'Bryant Stehr'],
      averageRating: 2,
      createdAt: '2023-07-22T11:57:12.103Z',
      updatedAt: '2023-07-22T11:57:12.103Z',
    },
    {
      _id: '64b65b4682d839401f527fcf',
      title: 'The Devil to Pay in the Backlands',
      url: 'https://robohash.org/40',
      price: 512,
      authors: ['Mable Kris', 'Ms. Beatrice Ernser', 'Elizabeth Bogisich'],
      averageRating: 5,
      createdAt: '2023-07-22T11:57:12.103Z',
      updatedAt: '2023-07-22T11:57:12.103Z',
    },
  ],
};
