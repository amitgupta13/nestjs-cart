import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  cardToken: string;

  @ApiProperty()
  @IsString()
  address: string;
}
