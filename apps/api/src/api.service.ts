import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { ORDERS_SERVICE } from '@app/common/constants';
import { CreateOrderRequest } from '@app/common/dto/create-order-request';

@Injectable()
export class ApiService {
  constructor(@Inject(ORDERS_SERVICE) private ordersClient: ClientProxy) {}

  async getHello() {
    return this.ordersClient.send('get_hello', {});
  }

  async createOrder(request: CreateOrderRequest, authentication: string) {
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
