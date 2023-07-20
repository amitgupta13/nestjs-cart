import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, ValidateNested } from 'class-validator';

class CartItem {
  @ApiProperty()
  @IsMongoId()
  book: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class AddToCartDto {
  @ApiProperty({ type: () => [CartItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  items: CartItem[];
}
