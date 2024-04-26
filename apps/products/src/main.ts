import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { RmqService, TcpService } from '@app/common';
import { RMQ_PRODUCTS, TCP_PRODUCTS } from '@app/common/constants';
import { ValidationPipe } from '@nestjs/common';
import { ErrorLoggerInterceptor } from '@app/common/middlewares/error-logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const rmqService = app.get<RmqService>(RmqService);
  const tcpService = app.get<TcpService>(TcpService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorLoggerInterceptor());
  app.connectMicroservice(rmqService.getOptions(RMQ_PRODUCTS), { inheritAppConfig: true });
  app.connectMicroservice(tcpService.getOptions(TCP_PRODUCTS), { inheritAppConfig: true });
  await app.startAllMicroservices();
}
bootstrap();
