import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { OrdersService } from './orders.service';
import { ExampleRequest } from '@app/common/dto/example-request';
import { RpcErrorInterceptor } from '@app/common/middleware/RpcErrorInterceptor';
import { RmqPayload } from '@app/common/dto/rmq-payload';

@Controller()
@UseInterceptors(RpcErrorInterceptor)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('rpc_example')
  handleRpcExample(@Ctx() context: RmqContext): string {
    this.rmqService.ack(context);
    return this.ordersService.rpcExample();
  }

  @EventPattern('pub_sub_example')
  async handlePubSubExample(@Payload() pl: RmqPayload<ExampleRequest>, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    this.ordersService.pubSubExample(pl.data);
  }
}
