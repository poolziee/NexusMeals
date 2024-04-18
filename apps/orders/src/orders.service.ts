import { Injectable } from '@nestjs/common';
import { ExampleRequest } from '@app/common/dto/example-request';

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
