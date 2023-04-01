import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

// To be replaced by caching later

@Schema()
export class Token {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  refreshToken: string;

  @Prop({ type: Date, default: Date.now, expires: 86400 })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
