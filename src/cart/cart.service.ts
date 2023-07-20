import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas';
import { Model } from 'mongoose';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { User } from '../users/schemas';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  addToCart(body: AddToCartDto, user) {
    const cart = new this.cartModel({ ...body, user: user._id });
    return this.cartModel.findOneAndUpdate(
      { user: cart.user },
      { items: cart.items },
      {
        upsert: true,
        new: true,
      },
    );
  }

  getCart(user) {
    return this.cartModel.findOne({ user: user._id }).populate('items.book');
  }

  removeCart(user) {
    return this.cartModel.deleteMany({ user: user._id });
  }
}
