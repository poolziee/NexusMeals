import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ApiModule } from './api.module';
import cookieParser from 'cookie-parser';
import { RpcExceptionFilter } from './middleware/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const env = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RpcExceptionFilter());
  app.use(cookieParser());
  // TODO: add production origin.
  app.enableCors({ origin: ['http://localhost:7000', '*'], credentials: true });
  await app.listen(env.get('API_PORT'));
}
bootstrap();
