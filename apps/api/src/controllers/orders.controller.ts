import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middleware/auth.guard';
import { RmqClient, TcpClient } from '@app/common';
import { RMQ_ORDERS, TCP_ORDERS } from '@app/common/constants';
import { ExampleRequest, NexPayload, UserSession } from '@app/common/dto';
import { CurrentUser } from '@app/common/decorators';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@app/common/roles';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(
    @Inject(TCP_ORDERS) private tcpOrders: TcpClient,
    @Inject(RMQ_ORDERS) private rmqOrders: RmqClient,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async pubSubExample(@CurrentUser() user: UserSession, @Body() request: ExampleRequest) {
    await this.rmqOrders.emit('pub_sub_example', new NexPayload(request, user));
    return `ApiService.pubSubExample emitted.`;
  }

  @Get()
  async rpcExample() {
    return await this.tcpOrders.send('rpc_example', new NexPayload({}));
  }
}
