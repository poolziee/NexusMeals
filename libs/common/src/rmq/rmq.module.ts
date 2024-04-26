import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum';

import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: string;
  other: number;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (env: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [env.get<string>('RABBITMQ_URI')],
                queue: env.get<string>(`${name}_QUEUE`),
                // Uncomment this section when debugging.
                // socketOptions: {
                //   heartbeatIntervalInSeconds: 3600,
                // },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
