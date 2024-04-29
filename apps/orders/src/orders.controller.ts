import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { OrdersService } from './orders.service';
import { PN } from '@app/common/constants';
import { CurrentUser } from '@app/common/decorators';
import { ExampleRequest, NexPayload, UserSession } from '@app/common/dto';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(PN.rpc_example, Transport.TCP)
  handleRpcExample(): string {
    return this.ordersService.rpcExample();
  }

  @EventPattern(PN.pub_sub_example, Transport.RMQ)
  async handlePubSubExample(@CurrentUser() user: UserSession, @Payload() pl: NexPayload<ExampleRequest>) {
    console.log('Received user:', user);
    this.ordersService.pubSubExample(pl.data);
  }
}
