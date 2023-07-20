import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class CartItem {
  @ApiProperty()
  @IsString()
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
