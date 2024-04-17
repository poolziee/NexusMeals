import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { RmqService } from '@app/common';
import { PRODUCTS_SERVICE } from '@app/common/constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(rmqService.getOptions(PRODUCTS_SERVICE), { inheritAppConfig: true });
  await app.startAllMicroservices();
}
bootstrap();
