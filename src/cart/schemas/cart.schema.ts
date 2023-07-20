import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

type CartDocument = HydratedDocument<Cart>;

@Schema()
export class CartItem {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Book',
  })
  book: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  quantity: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
class Cart {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: [CartItemSchema],
  })
  items: CartItem[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const CartSchema = SchemaFactory.createForClass(Cart);

export { CartSchema, Cart, CartDocument };
