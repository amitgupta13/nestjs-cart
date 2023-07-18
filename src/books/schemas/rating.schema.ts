import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

type RatingDocument = HydratedDocument<Rating>;

@Schema()
class Rating {
  @Prop({
    required: true,
    max: [5, 'Rating cannot be more than 5'],
    min: [1, 'Rating cannot be less than 1'],
  })
  rating: number;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Book',
  })
  book: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;
}

const RatingSchema: any = SchemaFactory.createForClass(Rating);

// Prevent user from submitting more than 1 review per book
RatingSchema.index({ book: 1, user: 1 }, { unique: true });

RatingSchema.statics.getAverageRating = async function (bookId) {
  const [{ averageRating }] = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Book').findByIdAndUpdate(bookId, {
      averageRating,
    });
  } catch (e) {
    console.log(e);
  }
};

//Call getAverageCost after save
RatingSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.book);
});

RatingSchema.post('findOneAndUpdate', async function (doc) {
  await this.model.getAverageRating(doc.book);
});

//Call getAverageCost before remove save
RatingSchema.pre('remove', async function () {
  await this.constructor.getAverageRating(this.book);
});

export { RatingSchema, Rating, RatingDocument };
