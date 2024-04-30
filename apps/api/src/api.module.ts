import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { TCP_ORDERS, TCP_USERS, RMQ_ORDERS, REDIS_SESSIONS, TCP_INVENTORY } from '@app/common/constants';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { RmqModule, TcpModule } from '@app/common';
import { AuthController, InventoryController, OrdersController, UsersController } from './controllers';
import { SessionService } from './session.service';
import { RedisModule } from '@app/common/redis/redis.module';
import { UserSessionProfile } from './user-session.profile';

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

        TCP_INVENTORY_HOST: Joi.string().required(),
        TCP_INVENTORY_PORT: Joi.string().required(),

        RABBITMQ_URI: Joi.string().required(),
        RMQ_ORDERS_QUEUE: Joi.string().required(),

        SECRET_KEY: Joi.string().required(),

        REDIS_SESSIONS_HOST: Joi.string().required(),
        REDIS_SESSIONS_PORT: Joi.string().required(),
      }),
    }),
    TcpModule.register(TCP_ORDERS),
    TcpModule.register(TCP_USERS),
    TcpModule.register(TCP_INVENTORY),
    RmqModule.register({ name: RMQ_ORDERS, other: 0 }),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    RedisModule.register(REDIS_SESSIONS),
  ],
  controllers: [AuthController, OrdersController, InventoryController, UsersController],
  providers: [SessionService, UserSessionProfile],
})
export class ApiModule {}
