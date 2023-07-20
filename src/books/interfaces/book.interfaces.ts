import { NonEmptyArray } from '../../global.interfaces';

export interface BookInterface {
  _id?: any;
  title: string;
  price: number;
  authors: NonEmptyArray<string>;
  averageRating: number;
  url: string;
}
