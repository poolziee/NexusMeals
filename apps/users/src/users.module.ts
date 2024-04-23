import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { RmqModule, DbModule } from '@app/common';
import { USERS_DB } from '@app/common/constants';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UserEntityProfile } from './entities/user.entity.profile';
import { TcpModule } from '@app/common/tcp/tcp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RMQ_USERS_QUEUE: Joi.string().required(),

        TCP_USERS_HOST: Joi.string().required(),
        TCP_USERS_PORT: Joi.string().required(),

        MYSQL_USERS_URI: Joi.string().required(),
      }),
    }),
    RmqModule,
    TcpModule,
    DbModule({ name: USERS_DB }),
    TypeOrmModule.forFeature([UserEntity]),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
  controllers: [UsersController],
  // TODO: Interfaces instead of classes for testing purposes. Applies for all services' modules.
  providers: [UsersService, UsersRepository, UserEntityProfile],
})
export class UsersModule {}
