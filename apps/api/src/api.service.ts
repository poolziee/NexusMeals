import { Inject, Injectable } from '@nestjs/common';
import { RMQ_ORDERS, TCP_ORDERS, TCP_USERS } from '@app/common/constants';
import { ExampleRequest } from '@app/common/dto/example-request';
import { RegisterRequest, RegisterResponse } from '@app/common/dto/register-dto';
import { LoginRequest } from '@app/common/dto/login-dto';
import { NexPayload } from '@app/common/dto/nex-payload';
import { UserSession } from '@app/common/dto/user-session-dto';
import { TcpClient, RmqClient } from '@app/common';

@Injectable()
export class ApiService {
  constructor(
    @Inject(TCP_ORDERS) private tcpOrders: TcpClient,
    @Inject(TCP_USERS) private tcpUsers: TcpClient,
    @Inject(RMQ_ORDERS) private rmqOrders: RmqClient,
  ) {}

  async rpcExample() {
    return await this.tcpOrders.send('rpc_example', new NexPayload({}));
  }

  async pubSubExample(request: ExampleRequest, user: UserSession) {
    await this.rmqOrders.emit('pub_sub_example', new NexPayload(request, user));
    return `ApiService.pubSubExample emitted.`;
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return await this.tcpUsers.send('register', new NexPayload(request));
  }

  async login(request: LoginRequest): Promise<RegisterResponse> {
    return await this.tcpUsers.send('login', new NexPayload(request));
  }
}
