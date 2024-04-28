import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middleware/auth.guard';
import { PN, RMQ_ORDERS, TCP_ORDERS } from '@app/common/constants';
import { ExampleRequest, NexPayload, UserSession } from '@app/common/dto';
import { CurrentUser } from '@app/common/decorators';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@app/common/roles';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(
    @Inject(TCP_ORDERS) private tcpOrders: ClientProxy,
    @Inject(RMQ_ORDERS) private rmqOrders: ClientProxy,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async pubSubExample(@CurrentUser() user: UserSession, @Body() pl: ExampleRequest) {
    await lastValueFrom(this.rmqOrders.emit(PN.pub_sub_example, new NexPayload(pl, user)));
    return `ApiService.pubSubExample emitted.`;
  }

  @Get()
  async rpcExample() {
    return await firstValueFrom(this.tcpOrders.send(PN.rpc_example, new NexPayload({})));
  }
}
