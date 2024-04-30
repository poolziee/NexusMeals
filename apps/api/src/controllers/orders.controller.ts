import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middleware/auth.guard';
import { PN, TCP_ORDERS } from '@app/common/constants';
import { NexPayload } from '@app/common/dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(@Inject(TCP_ORDERS) private tcpOrders: ClientProxy) {}

  @Get()
  async rpcExample() {
    return await firstValueFrom(this.tcpOrders.send(PN.rpc_example, new NexPayload({})));
  }
}
