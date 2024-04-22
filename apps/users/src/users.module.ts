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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_USERS_QUEUE: Joi.string().required(),

        MYSQL_USERS_URI: Joi.string().required(),
      }),
    }),
    RmqModule,
    // TODO: specifying entities as argument to DbModule doesn't work. Investigate and solve.
    DbModule({ name: USERS_DB }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  // TODO: Interfaces instead of classes for testing purposes. Applies for all services' modules.
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
