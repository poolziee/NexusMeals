import { ExampleRequest } from '@app/common/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  rpcExample(): string {
    return 'Hello World!';
  }

  pubSubExample(exampleInfo: ExampleRequest) {
    console.log('Received info:', exampleInfo);
    return 'Info received.';
  }
}
