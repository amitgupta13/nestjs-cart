import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dtos/create-order.dto';
import { randomBytes } from 'crypto';
import { CartService } from '../cart/cart.service';
import { DispatchStatus, TransactionStatus } from '../constants';
import { CartItem } from 'src/cart/schemas/cart.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
  ) {}

  getOrders(user) {
    return this.orderModel.findOne({ user: user._id }).populate('items.book');
  }

  async addOrder(body: CreateOrderDto, user) {
    const cart: any = await this.cartService.getCart(user);
    if (!cart || !cart?.items?.length)
      throw new NotFoundException('Cart for the given user does not exists');

    const amount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.book.price,
      0,
    );

    const { transactionId, isError } = this.makeFakePayment(
      body.cardToken,
      amount,
    );
    if (transactionId && !isError)
      await this.createOrder({
        address: body.address,
        user: user._id,
        transactionId,
        transactionStatus: TransactionStatus.SUCCESS,
        dispatchStatus: DispatchStatus.INITIATED,
        items: cart.items.map((item) => ({
          quantity: item.quantity,
          book: item.book._id,
        })),
        amount,
      });

    await this.cartService.removeCart(user);

    return {
      status: true,
      message: 'Order created successfully',
    };
  }

  // Helper function that mimics a payment call to gateway and returns a transaction Id
  makeFakePayment(token: string, amount: number) {
    return {
      transactionId: randomBytes(8).toString('hex'),
      isError: false,
      error: null,
    };
  }

  async createOrder(obj: Partial<Order>) {
    const order = new this.orderModel(obj);
    return order.save();
  }
}
