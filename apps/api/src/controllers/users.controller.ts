import { PN, TCP_USERS } from '@app/common/constants';
import { Body, Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../middleware/auth.guard';
import { CurrentUser } from '@app/common/decorators';
import { NexPayload, ReadChefsRequest, UserSession } from '@app/common/dto';
import { firstValueFrom } from 'rxjs';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(@Inject(TCP_USERS) private tcpOrders: ClientProxy) {}

  @Get('chefs')
  async getChefs(@CurrentUser() user: UserSession, @Body() data: ReadChefsRequest) {
    return await firstValueFrom(this.tcpOrders.send(PN.get_chefs, new NexPayload(data, user)));
  }
}
