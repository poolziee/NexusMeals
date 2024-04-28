import { RMQ_ORDERS } from '@app/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(@Inject(RMQ_ORDERS) private rmqOrders: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }
}
