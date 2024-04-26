import { RMQ_ORDERS } from '@app/common/constants';
import { RmqClient } from '@app/common/rmq/rmq.client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(@Inject(RMQ_ORDERS) private rmqOrders: RmqClient) {}

  getHello(): string {
    return 'Hello World!';
  }
}
