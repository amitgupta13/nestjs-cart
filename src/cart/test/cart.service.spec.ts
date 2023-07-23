import { Model } from 'mongoose';
import { CartService } from '../cart.service';
import { CartDocument, Cart } from '../schemas';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MockCartModel, addToCartMockRequest } from './mock';

describe('CartService', () => {
  let service: CartService;
  let fakeCartModel: jest.Mocked<Model<CartDocument>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: MockCartModel,
        },
      ],
    }).compile();

    service = module.get(CartService);
    fakeCartModel = module.get(getModelToken(Cart.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add item to cart', async () => {
    const addToCart = await service.addToCart(addToCartMockRequest, {});
    expect(addToCart).toBeDefined();
  });

  it('should get cart of a user', async () => {
    const addToCart = await service.getCart({});
    expect(addToCart).toBeDefined();
  });

  it('should remove cart of a user', async () => {
    const addToCart = await service.removeCart({});
    expect(addToCart).toBeDefined();
  });
});
