import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/schemas';
import { CreateOrderDto } from './dtos/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-auth-token',
})
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  getOrders(@CurrentUser() user: User) {
    return this.ordersService.getOrders(user);
  }

  @Post()
  createOrder(@Body() body: CreateOrderDto, @CurrentUser() user) {
    return this.ordersService.addOrder(body, user);
  }
}
