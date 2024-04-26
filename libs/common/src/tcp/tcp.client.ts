import { ClientProxy } from '@nestjs/microservices';
import { NexPayload } from '../dto/nex-payload';
import { lastValueFrom } from 'rxjs';
import { PN } from '../constants';

export class TcpClient {
  constructor(private client: ClientProxy) {}

  async send(pattern: PN, payload: NexPayload<any>) {
    return await lastValueFrom(this.client.send(pattern, payload));
  }
}
