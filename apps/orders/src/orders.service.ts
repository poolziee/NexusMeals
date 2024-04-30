import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  rpcExample(): string {
    return 'Hello World!';
  }
}
