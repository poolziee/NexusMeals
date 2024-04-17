import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { OrdersService } from './orders.service';
import { CreateOrderRequest } from '../../../libs/common/src/dto/create-order-request';
import { RpcErrorInterceptor } from '@app/common/middleware/RpcErrorInterceptor';
import { RmqPayload } from '@app/common/dto/rmq-payload';

@Controller()
@UseInterceptors(RpcErrorInterceptor)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('get_hello')
  getHello(@Ctx() context: RmqContext): string {
    this.rmqService.ack(context);
    return this.ordersService.getHello();
  }

  // TODO: change to MessagePattern.
  @EventPattern('order_created')
  async handleOrderCreated(@Payload() pl: RmqPayload<CreateOrderRequest>, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    this.ordersService.createOrder(pl.data);
  }
}
