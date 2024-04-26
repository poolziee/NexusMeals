import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { TCP_ORDERS, TCP_USERS, RMQ_ORDERS } from '@app/common/constants';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { RpcExceptionFilter } from './middleware/rpc-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { RmqModule, TcpModule } from '@app/common';
import { AuthController, OrdersController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),

        TCP_ORDERS_HOST: Joi.string().required(),
        TCP_ORDERS_PORT: Joi.string().required(),

        TCP_USERS_HOST: Joi.string().required(),
        TCP_USERS_PORT: Joi.string().required(),

        RABBITMQ_URI: Joi.string().required(),
        RMQ_ORDERS_QUEUE: Joi.string().required(),
      }),
    }),
    TcpModule.register(TCP_ORDERS),
    TcpModule.register(TCP_USERS),
    RmqModule.register({ name: RMQ_ORDERS, other: 0 }),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [AuthController, OrdersController],
  providers: [{ provide: APP_FILTER, useClass: RpcExceptionFilter }],
})
export class ApiModule {}
