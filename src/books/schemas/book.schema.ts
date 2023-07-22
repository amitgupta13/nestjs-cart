import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
class Book {
  @Prop({
    required: true,
    trim: true,
    maxlength: [50, 'Book name cannot be more than 10 chars'],
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  url: string;

  @Prop({
    required: true,
  })
  price: number;

  @Prop({
    required: true,
    type: [String],
    minlength: [1, 'There should be at least 1 author'],
  })
  authors: string[];

  @Prop({
    required: true,
    max: [5, 'Rating cannot be more than 5'],
  })
  averageRating: number;
}

const BookSchema: any = SchemaFactory.createForClass(Book);

export { BookSchema, Book, BookDocument };
