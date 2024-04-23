import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { RmqModule } from '@app/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ORDERS_SERVICE } from '@app/common/constants';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_PRODUCTS_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: ORDERS_SERVICE,
      other: 0,
    }),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
