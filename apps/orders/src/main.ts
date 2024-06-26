import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { RmqService, TcpService } from '@app/common';
import { RMQ_ORDERS, TCP_ORDERS } from '@app/common/constants';
import { ValidationPipe } from '@nestjs/common';
import { ErrorLoggerInterceptor } from '@app/common/middlewares';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const rmqService = app.get<RmqService>(RmqService);
  const tcpService = app.get<TcpService>(TcpService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorLoggerInterceptor());
  app.connectMicroservice(rmqService.getOptions(RMQ_ORDERS), { inheritAppConfig: true });
  app.connectMicroservice(tcpService.getOptions(TCP_ORDERS), { inheritAppConfig: true });
  await app.startAllMicroservices();
}
bootstrap();
