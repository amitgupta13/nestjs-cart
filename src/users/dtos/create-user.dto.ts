import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  IsMobilePhone,
  MinLength,
  Matches,
} from 'class-validator';
import { regex } from '../../constants';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @ApiProperty()
  firstName: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @ApiProperty({ default: 'test@test.com' })
  email: string;

  @IsMobilePhone()
  @ApiProperty()
  mobile: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  @Matches(regex.password)
  password: string;
}
