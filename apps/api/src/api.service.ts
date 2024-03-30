import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { ORDERS_SERVICE } from '@app/common/constants';
import { CreateOrderRequest } from '@app/common/dto/create-order-request';

@Injectable()
export class ApiService {
  constructor(@Inject(ORDERS_SERVICE) private ordersClient: ClientProxy) {}

  async getHello() {
    return await lastValueFrom(this.ordersClient.send('get_hello', {})).catch((err) => {
      // TODO: Investigate if it can be solved with interceptor to avoid .catch on every .send.
      throw new Error(err.message);
    });
  }

  async createOrder(request: CreateOrderRequest, authentication: string) {
    // TODO: Avoid try-catch where possible.
    try {
      const emitResult = await lastValueFrom(
        this.ordersClient.emit('order_created', { request, Authentication: authentication }),
      );
      return `ApiService.createOrder Emit result ${emitResult}`;
    } catch (err) {
      throw err;
    }
  }
}
