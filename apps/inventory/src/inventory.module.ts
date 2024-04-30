import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { DbModule, RmqModule, TcpModule } from '@app/common';

import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { INVENTORY_DB, RMQ_ORDERS, RMQ_USERS } from '@app/common/constants';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { InventoryProfile } from './entities/inventory.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesRepository, ProductsRepository } from './repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RMQ_INVENTORY_QUEUE: Joi.string().required(),
        RMQ_ORDERS_QUEUE: Joi.string().required(),
        RMQ_USERS_QUEUE: Joi.string().required(),

        TCP_INVENTORY_HOST: Joi.string().required(),
        TCP_INVENTORY_PORT: Joi.string().required(),

        MYSQL_INVENTORY_URI: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: RMQ_ORDERS,
      other: 0,
    }),
    RmqModule.register({
      name: RMQ_USERS,
      other: 0,
    }),
    TcpModule,
    DbModule({ name: INVENTORY_DB }),
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, ProductsRepository, CategoriesRepository, InventoryProfile],
})
export class InventoryModule {}
