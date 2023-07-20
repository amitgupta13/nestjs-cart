import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { CartItem, CartItemSchema } from '../../cart/schemas/cart.schema';
import { DispatchStatus, TransactionStatus } from '../../constants';

type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
class Order {
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

  @Prop({
    required: true,
    type: String,
  })
  address: string;

  @Prop({
    type: String,
    default: null,
  })
  transactionId: string;

  @Prop({
    type: Number,
    required: true,
  })
  amount: number;

  @Prop({
    type: Number,
    required: true,
    enum: TransactionStatus,
  })
  transactionStatus: number;

  @Prop({
    type: Number,
    required: true,
    enum: DispatchStatus,
  })
  dispatchStatus: number;
}

const OrderSchema = SchemaFactory.createForClass(Order);

export { OrderSchema, Order, OrderDocument };
