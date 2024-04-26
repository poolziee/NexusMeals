import { ClientProxy } from '@nestjs/microservices';
import { NexPayload } from '../dto/nex-payload';
import { lastValueFrom } from 'rxjs';

export class RmqClient {
  constructor(private client: ClientProxy) {}

  async emit(pattern: string, payload: NexPayload<any>) {
    await lastValueFrom(this.client.emit(pattern, payload));
  }
}