import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/schemas';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-auth-token',
})
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  addToCart(@Body() body: AddToCartDto, @CurrentUser() user: User) {
    return this.cartService.addToCart(body, user);
  }

  @Get()
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user);
  }
}
