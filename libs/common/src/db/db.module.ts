import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

interface DbModuleOptions {
  name: string;
}

export function DbModule({ name }: DbModuleOptions) {
  return TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      url: configService.get<string>(`MYSQL_${name}_URI`),
      synchronize: true, // TODO: Do not use in production. Might cause data loss.
      logging: true,
      autoLoadEntities: true,
    }),
    inject: [ConfigService],
  });
}
