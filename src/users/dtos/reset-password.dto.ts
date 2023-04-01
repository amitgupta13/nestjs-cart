import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { regex } from '../../constants';

export class ResetPasswordDto {
  @IsString()
  @ApiProperty()
  @Matches(regex.password)
  password: string;
}
