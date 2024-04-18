import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORDERS_SERVICE } from '@app/common/constants';
import { ExampleRequest } from '@app/common/dto/example-request';

@Injectable()
export class ApiService {
  constructor(@Inject(ORDERS_SERVICE) private ordersClient: ClientProxy) {}

  async rpcExample() {
    return await lastValueFrom(this.ordersClient.send('rpc_example', {}));
  }

  async pubSubExample(request: ExampleRequest, authentication: string) {
    const emitResult = await lastValueFrom(
      this.ordersClient.emit('pub_sub_example', { data: request, Authentication: authentication }),
    );
    return `ApiService.pubSubExample Emit result ${emitResult}`;
  }
}
