import { ORDERS_SERVICE } from '@app/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(@Inject(ORDERS_SERVICE) private ordersClient: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }
}
