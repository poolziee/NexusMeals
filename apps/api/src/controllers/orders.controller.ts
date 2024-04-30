import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middleware/auth.guard';
import { PN, TCP_ORDERS } from '@app/common/constants';
import { NexPayload } from '@app/common/dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Role } from '@app/common/roles';
import { Roles } from '../decorators/roles.decorator';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(@Inject(TCP_ORDERS) private tcpOrders: ClientProxy) {}

  @Get()
  @Roles(Role.CUSTOMER)
  async rpcExample() {
    return await firstValueFrom(this.tcpOrders.send(PN.rpc_example, new NexPayload({})));
  }
}
