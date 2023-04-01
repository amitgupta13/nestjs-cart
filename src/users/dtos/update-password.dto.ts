import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { regex } from '../../constants';

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty()
  @Matches(regex.password)
  currentPassword: string;

  @IsString()
  @ApiProperty()
  @Matches(regex.password)
  newPassword: string;
}
