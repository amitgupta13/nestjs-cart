export const addToCartMockRequest = {
  items: [{ quantity: 1, book: '64b65b4682d839401f527fd2' }],
};

const addToCartMockResponse = {
  _id: '64bc2d9cd0b6e39ce9081ad8',
  user: '6426b423be4101869c9fdc92',
  __v: 0,
  createdAt: '2023-07-22T19:27:24.150Z',
  items: [
    {
      book: '64b65b4682d839401f527fd2',
      quantity: 1,
      createdAt: '2023-07-22T19:27:24.147Z',
      _id: '64bc2d9c972642031dbc825f',
    },
  ],
};

const getCartResponse = {
  _id: '64bc2d9cd0b6e39ce9081ad8',
  user: '6426b423be4101869c9fdc92',
  __v: 0,
  createdAt: '2023-07-22T19:27:24.150Z',
  items: [
    {
      book: {
        _id: '64b65b4682d839401f527fd2',
        title: 'Iliad',
        url: 'https://robohash.org/43',
        price: 835,
        authors: ['Molly Mraz', 'Sarah Kutch'],
        averageRating: 4,
        createdAt: '2023-07-22T11:57:12.103Z',
        updatedAt: '2023-07-22T11:57:12.103Z',
      },
      quantity: 1,
      createdAt: '2023-07-22T19:27:24.147Z',
      _id: '64bc2d9c972642031dbc825f',
    },
  ],
};

export class MockCartModel {
  static findOneAndUpdate = () => addToCartMockResponse;

  static findOne = () => ({
    populate: () => getCartResponse,
  });

  static deleteMany = () => [];
}
