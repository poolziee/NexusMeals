import { ClientProxy } from '@nestjs/microservices';
import { NexPayload } from '../dto/nex-payload';
import { lastValueFrom } from 'rxjs';

export class TcpClient {
  constructor(private client: ClientProxy) {}

  async send(pattern: string, payload: NexPayload<any>) {
    return await lastValueFrom(this.client.send(pattern, payload));
  }
}
