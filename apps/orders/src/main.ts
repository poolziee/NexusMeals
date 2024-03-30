import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { RmqService } from '@app/common';
import { ORDERS_SERVICE } from '@app/common/constants';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const rmqService = app.get<RmqService>(RmqService);
  // TODO: use validation pipe?
  app.connectMicroservice(rmqService.getOptions(ORDERS_SERVICE));
  await app.startAllMicroservices();
}
bootstrap();
