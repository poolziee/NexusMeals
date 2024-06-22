import { RmqModule, TcpModule } from '@app/common';

import { AutomapperModule } from '@automapper/nestjs';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { classes } from '@automapper/classes';
import { RMQ_INVENTORY } from '@app/common/constants';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RMQ_ORDERS_QUEUE: Joi.string().required(),
        RMQ_INVENTORY_QUEUE: Joi.string().required(),

        TCP_ORDERS_HOST: Joi.string().required(),
        TCP_ORDERS_PORT: Joi.string().required(),

        ORDERS_DB_URI: Joi.string().required(),
        ORDERS_DB_NAME: Joi.string().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: RMQ_INVENTORY,
      other: 0,
    }),
    TcpModule,
    MongooseModule.forRoot(process.env.ORDERS_DB_URI, {
      dbName: process.env.ORDERS_DB_NAME,
      auth: {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
      },
    }),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
