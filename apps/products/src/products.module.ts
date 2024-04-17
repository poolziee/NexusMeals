import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { RmqModule } from '@app/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_PRODUCTS_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
