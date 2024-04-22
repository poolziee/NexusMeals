import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

interface DbModuleOptions {
  name: string;
}

export function DbModule({ name }: DbModuleOptions) {
  return TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      url: configService.get<string>(`POSTGRES_${name}_URI`),
      synchronize: true, // TODO: Do not use in production. Might cause data loss.
      logging: true,
    }),
    inject: [ConfigService],
  });
}
