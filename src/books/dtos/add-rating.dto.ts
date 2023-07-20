import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString, Max, Min } from 'class-validator';

export class AddRatingDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  book: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
