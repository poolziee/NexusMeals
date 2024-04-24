import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RMQ_ORDERS, TCP_ORDERS, TCP_USERS } from '@app/common/constants';
import { ExampleRequest } from '@app/common/dto/example-request';
import { RegisterRequest, RegisterResponse } from '@app/common/dto/register-dto';
import { LoginRequest } from '@app/common/dto/login-dto';
import { NexPayload } from '@app/common/dto/nex-payload';
import { UserSession } from '@app/common/dto/user-session-dto';

@Injectable()
export class ApiService {
  constructor(
    @Inject(TCP_ORDERS) private tcpOrders: ClientProxy,
    @Inject(TCP_USERS) private tcpUsers: ClientProxy,
    @Inject(RMQ_ORDERS) private rmqOrders: ClientProxy,
  ) {}

  async rpcExample() {
    return await lastValueFrom(this.tcpOrders.send('rpc_example', {}));
  }

  async pubSubExample(request: ExampleRequest, user: UserSession) {
    const emitResult = await lastValueFrom(this.rmqOrders.emit('pub_sub_example', new NexPayload(request, user)));
    return `ApiService.pubSubExample Emit result ${emitResult}`;
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return await lastValueFrom(this.tcpUsers.send('register', new NexPayload(request)));
  }

  async login(request: LoginRequest): Promise<RegisterResponse> {
    return await lastValueFrom(this.tcpUsers.send('login', new NexPayload(request)));
  }
}
