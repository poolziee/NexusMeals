import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORDERS_SERVICE, USERS_SERVICE } from '@app/common/constants';
import { ExampleRequest } from '@app/common/dto/example-request';
import { RegisterRequest, RegisterResponse } from '@app/common/dto/register-dto';
import { LoginRequest } from '@app/common/dto/login-dto';

@Injectable()
export class ApiService {
  constructor(
    @Inject(ORDERS_SERVICE) private ordersClient: ClientProxy,
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
  ) {}

  async rpcExample() {
    return await lastValueFrom(this.ordersClient.send('rpc_example', {}));
  }

  async pubSubExample(request: ExampleRequest, authentication: string) {
    const emitResult = await lastValueFrom(
      this.ordersClient.emit('pub_sub_example', { data: request, Authentication: authentication }),
    );
    return `ApiService.pubSubExample Emit result ${emitResult}`;
  }

  async register(request: RegisterRequest, authentication: string): Promise<RegisterResponse> {
    return await lastValueFrom(this.usersClient.send('register', { data: request, Authentication: authentication }));
  }

  async login(request: LoginRequest, authentication: string): Promise<RegisterResponse> {
    return await lastValueFrom(this.usersClient.send('login', { data: request, Authentication: authentication }));
  }
}
