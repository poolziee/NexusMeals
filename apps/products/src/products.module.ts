import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { RmqModule, TcpModule } from '@app/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RMQ_ORDERS } from '@app/common/constants';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RMQ_PRODUCTS_QUEUE: Joi.string().required(),
        RMQ_ORDERS_QUEUE: Joi.string().required(),

        TCP_PRODUCTS_HOST: Joi.string().required(),
        TCP_PRODUCTS_PORT: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: RMQ_ORDERS,
      other: 0,
    }),
    TcpModule,
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
