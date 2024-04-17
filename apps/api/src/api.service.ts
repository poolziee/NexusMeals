import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { ORDERS_SERVICE } from '@app/common/constants';
import { CreateOrderRequest } from '@app/common/dto/create-order-request';

@Injectable()
export class ApiService {
  constructor(@Inject(ORDERS_SERVICE) private ordersClient: ClientProxy) {}

  async getHello() {
    return await lastValueFrom(this.ordersClient.send('get_hello', {}));
  }

  async createOrder(request: CreateOrderRequest, authentication: string) {
    const emitResult = await lastValueFrom(
      this.ordersClient.emit('order_created', { data: request, Authentication: authentication }),
    );
    return `ApiService.createOrder Emit result ${emitResult}`;
  }
}
