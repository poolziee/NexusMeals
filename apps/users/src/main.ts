import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { USERS_SERVICE } from '@app/common/constants';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(rmqService.getOptions(USERS_SERVICE), { inheritAppConfig: true });
  await app.startAllMicroservices();
}
bootstrap();
