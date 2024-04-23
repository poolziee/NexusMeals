import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum';

@Injectable()
export class TcpService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(name: string): MicroserviceOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>(`${name}_HOST`),
        port: parseInt(this.configService.get<string>(`${name}_PORT`)),
      },
    };
  }
}
