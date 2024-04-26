import { RMQ_USERS, TCP_USERS } from '@app/common/constants';
import { RmqService, TcpService } from '@app/common';

import { ErrorLoggerInterceptor } from '@app/common/middlewares/error-logger.interceptor';
import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const rmqService = app.get<RmqService>(RmqService);
  const tcpService = app.get<TcpService>(TcpService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorLoggerInterceptor());
  app.connectMicroservice(rmqService.getOptions(RMQ_USERS), { inheritAppConfig: true });
  app.connectMicroservice(tcpService.getOptions(TCP_USERS), { inheritAppConfig: true });
  await app.startAllMicroservices();
}
bootstrap();
