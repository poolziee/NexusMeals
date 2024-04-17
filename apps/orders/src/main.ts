import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { RmqService } from '@app/common';
import { ORDERS_SERVICE } from '@app/common/constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(rmqService.getOptions(ORDERS_SERVICE), { inheritAppConfig: true });
  await app.startAllMicroservices();
}
bootstrap();
