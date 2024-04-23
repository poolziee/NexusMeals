import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, Transport } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { OrdersService } from './orders.service';
import { ExampleRequest } from '@app/common/dto/example-request';
import { NexPayload } from '@app/common/dto/nex-payload';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern('rpc_example', Transport.TCP)
  handleRpcExample(): string {
    return this.ordersService.rpcExample();
  }

  @EventPattern('pub_sub_example', Transport.RMQ)
  async handlePubSubExample(@Payload() pl: NexPayload<ExampleRequest>, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    this.ordersService.pubSubExample(pl.data);
  }
}
