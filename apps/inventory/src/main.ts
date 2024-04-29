import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';
import { RmqService, TcpService } from '@app/common';
import { RMQ_INVENTORY, TCP_INVENTORY } from '@app/common/constants';
import { ValidationPipe } from '@nestjs/common';
import { ErrorLoggerInterceptor } from '@app/common/middlewares';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  const rmqService = app.get<RmqService>(RmqService);
  const tcpService = app.get<TcpService>(TcpService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorLoggerInterceptor());
  app.connectMicroservice(rmqService.getOptions(RMQ_INVENTORY), { inheritAppConfig: true });
  app.connectMicroservice(tcpService.getOptions(TCP_INVENTORY), { inheritAppConfig: true });
  await app.startAllMicroservices();
}
bootstrap();
