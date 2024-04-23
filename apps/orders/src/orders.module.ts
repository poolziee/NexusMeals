import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { RmqModule } from '@app/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_ORDERS_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
