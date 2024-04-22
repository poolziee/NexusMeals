import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { RmqModule } from '@app/common';
import { ORDERS_SERVICE, USERS_SERVICE } from '@app/common/constants';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_ORDERS_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: ORDERS_SERVICE,
      other: 0,
    }),
    RmqModule.register({
      name: USERS_SERVICE,
      other: 0,
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
