import { Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { OrdersService } from './orders.service';
import { PN } from '@app/common/constants';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(PN.rpc_example, Transport.TCP)
  handleRpcExample(): string {
    return 'Hello world.';
  }
}
