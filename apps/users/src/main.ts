import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { RmqService, TcpService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { TCP_USERS, RMQ_USERS } from '@app/common/constants';
import { ErrorLoggerInterceptor } from '@app/common/middlewares/error-logger.interceptor';

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
