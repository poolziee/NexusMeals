import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export type RedisClient = Redis;

@Module({})
export class RedisModule {
  static register(name: string): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          useFactory: (env: ConfigService): RedisClient => {
            return new Redis({
              host: env.get<string>(`${name}_HOST`),
              port: parseInt(env.get<string>(`${name}_PORT`)),
            });
          },
          provide: name,
          inject: [ConfigService],
        },
      ],
      exports: [name],
    };
  }
}
