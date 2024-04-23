import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RMQ_ORDERS, TCP_ORDERS, TCP_USERS } from '@app/common/constants';
import { ExampleRequest } from '@app/common/dto/example-request';
import { RegisterRequest, RegisterResponse } from '@app/common/dto/register-dto';
import { LoginRequest } from '@app/common/dto/login-dto';

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

  async pubSubExample(request: ExampleRequest, authentication: string) {
    const emitResult = await lastValueFrom(
      this.rmqOrders.emit('pub_sub_example', { data: request, Authentication: authentication }),
    );
    return `ApiService.pubSubExample Emit result ${emitResult}`;
  }

  async register(request: RegisterRequest, authentication: string): Promise<RegisterResponse> {
    return await lastValueFrom(this.tcpUsers.send('register', { data: request, Authentication: authentication }));
  }

  async login(request: LoginRequest, authentication: string): Promise<RegisterResponse> {
    return await lastValueFrom(this.tcpUsers.send('login', { data: request, Authentication: authentication }));
  }
}
