import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { OrdersService } from './orders.service';
import { CreateOrderRequest } from '../../../libs/common/src/dto/create-order-request';
import { RpcErrorInterceptor } from '@app/common/middleware/RpcErrorInterceptor';

@Controller()
@UseInterceptors(RpcErrorInterceptor)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('get_hello')
  getHello(@Ctx() context: RmqContext): string {
    // TODO: Use noack for messagepatterns.
    this.rmqService.ack(context);
    return this.ordersService.getHello();
  }

  // TODO: change to MessagePattern.
  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: CreateOrderRequest, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    this.ordersService.createOrder(data);
  }
}
