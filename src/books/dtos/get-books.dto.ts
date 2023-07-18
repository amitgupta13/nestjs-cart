import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetBooksDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  select: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sort: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  page: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  limit: string;
}
