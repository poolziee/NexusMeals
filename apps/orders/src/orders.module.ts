import { DbModule, RmqModule, TcpModule } from '@app/common';

import { AutomapperModule } from '@automapper/nestjs';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { classes } from '@automapper/classes';
import { ORDERS_DB, RMQ_INVENTORY } from '@app/common/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrdersRepository } from './repositories/orders.repository';
import { OrderProductEntity } from './entities/orderproduct.entity';
import { OrderProductsRepository } from './repositories/orderproducts.repository';

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

        MYSQL_ORDERS_URI: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: RMQ_INVENTORY,
      other: 0,
    }),
    TcpModule,
    DbModule({ name: ORDERS_DB }),
    TypeOrmModule.forFeature([OrderEntity, OrderProductEntity]),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrderProductsRepository],
})
export class OrdersModule {}
