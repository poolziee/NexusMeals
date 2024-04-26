import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { TcpService } from './tcp.service';

@Module({
  providers: [TcpService],
  exports: [TcpService],
})
export class TcpModule {
  static register(name: string): DynamicModule {
    return {
      module: TcpModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (env: ConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: env.get<string>(`${name}_HOST`),
                port: parseInt(env.get<string>(`${name}_PORT`)),
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
