import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsMobilePhone,
  Matches,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { regex } from '../../constants';

enum SignInType {
  mobile = 'mobile',
  email = 'email',
}

export class SigninUserDto {
  @IsEmail()
  @ApiProperty({ default: 'test@test.com' })
  @ValidateIf((o) => o.type === SignInType.email)
  @Transform((params) =>
    params.obj.type === SignInType.email ? params.value : undefined,
  )
  email: string;

  @IsMobilePhone()
  @ApiProperty()
  @ValidateIf((o) => o.type === SignInType.mobile)
  @Transform((params) =>
    params.obj.type === SignInType.mobile ? params.value : undefined,
  )
  mobile: string;

  @IsString()
  @ApiProperty()
  @Matches(regex.password)
  password: string;

  @IsEnum(SignInType)
  @ApiProperty({ default: 'email' })
  type: string;
}
