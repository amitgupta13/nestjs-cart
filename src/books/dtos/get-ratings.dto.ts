import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class GetRatingsDto {
  @IsMongoId()
  @ApiProperty()
  bookId: string;
}
