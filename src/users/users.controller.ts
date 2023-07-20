import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { LogoutDto } from './dtos/logout.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { Request } from 'express';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './schemas';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninUserDto) {
    return this.authService.signin(body);
  }

  @Delete('/logout')
  @ApiHeader({
    name: 'x-auth-token',
  })
  @UseGuards(AuthGuard)
  logout(@Body() body: LogoutDto) {
    return this.authService.logout(body);
  }

  @Post('/forgotpassword')
  forgotPassword(@Body() body: ForgotPasswordDto, @Req() req: Request) {
    return this.authService.forgotPassword(body, req);
  }

  @Put('/resetpassword/:resettoken')
  resetPassword(
    @Param('resettoken') token: string,
    @Body() body: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, body);
  }

  @Put('/updatepassword')
  @ApiHeader({
    name: 'x-auth-token',
  })
  @UseGuards(AuthGuard)
  updatePassword(
    @Body() body: UpdatePasswordDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.authService.updatePassword(body, currentUser);
  }

  @Post('/token')
  refreshToken(@Body() body: LogoutDto) {
    return this.authService.refreshToken(body);
  }
}
