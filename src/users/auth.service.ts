import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { UsersService } from './users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas';
import { Model } from 'mongoose';
import { LogoutDto } from './dtos/logout.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { Request } from 'express';
import { createHash } from 'crypto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async signup(userDto: CreateUserDto) {
    let [user] = await this.usersService.find(userDto.email, userDto.mobile);
    if (user) throw new ConflictException('User already exists');
    user = await this.usersService.create(userDto);
    return this.createAccessAndRefreshTokens(user);
  }

  async signin(signinDto: SigninUserDto) {
    let [user]: any = await this.usersService
      .find(signinDto.email, signinDto.mobile)
      .select('+password');
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    const isMatch = await user.matchPassword(signinDto.password);
    if (!isMatch) throw new UnauthorizedException('Invalid Credentials');
    return this.createAccessAndRefreshTokens(user);
  }

  logout(logoutDto: LogoutDto) {
    return this.tokenModel.deleteOne({ refreshToken: logoutDto.token });
  }

  async forgotPassword(forgotDto: ForgotPasswordDto, req: Request) {
    const [user]: any = await this.usersService.find(forgotDto.email, '');
    if (!user) throw new NotFoundException('User Not found');
    const resetToken = user.getPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/users/resetpassword/${resetToken}`;
    console.log({ resetUrl });
    const message = `You are receiving this email because you (or someone else) has 
  requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      // send Email

      return {
        success: true,
        data: 'Email Sent',
      };
    } catch (e) {
      console.log(e);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new HttpException('Email could not be sent', 500);
    }
  }

  async resetPassword(token: string, resetDto: ResetPasswordDto) {
    const resetPasswordToken = createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findOneBy({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw new BadRequestException('Invalid Token');

    user.password = resetDto.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    return this.createAccessAndRefreshTokens(user);
  }

  async refreshToken(refreshDto: LogoutDto) {
    const token = await this.tokenModel.findOne({
      refreshToken: refreshDto.token,
    });
    if (!token) throw new ForbiddenException('Unauthorized');
    // try {
    const user = await this.jwtService.verifyAsync(refreshDto.token, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });
    const accessToken = await await this.jwtService.signAsync({
      _id: user._id,
    });
    return { accessToken };
    // } catch (err) {
    //   throw new ForbiddenException('Unauthorized');
    // }
  }

  async updatePassword(updateDto: UpdatePasswordDto, currentUser) {
    const user: any = await this.usersService
      .findOne(currentUser._id)
      .select('+password');
    if (!(await user.matchPassword(updateDto.currentPassword)))
      throw new UnauthorizedException('Invalid Credentials');

    user.password = updateDto.newPassword;
    await user.save();
    return this.createAccessAndRefreshTokens(user);
  }

  private async createAccessAndRefreshTokens(user) {
    const accessToken = await this.jwtService.signAsync({ _id: user._id });
    const refreshToken = await this.signRefreshToken(user);
    await this.tokenModel.create({ refreshToken, userId: user._id });
    return { accessToken, refreshToken };
  }

  private signRefreshToken(user) {
    return this.jwtService.signAsync(
      { _id: user._id },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '24h',
      },
    );
  }
}
