import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../schemas';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token =
      req.headers['x-auth-token'] &&
      (req.headers['x-auth-token'] as string).split(' ')[1];
    if (token) {
      try {
        const decoded = await this.jwtService.verifyAsync(token);
        if (decoded) {
          const user = await this.usersService.findOne(decoded._id);
          req.currentUser = user;
        }
      } catch (err) {
        console.log('Error in current user middleware', { err });
      }
    }
    next();
  }
}
