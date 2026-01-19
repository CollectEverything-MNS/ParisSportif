import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { AuthToken } from '../entities/auth-token.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('AUTH_DB_HOST'),
  port: configService.get<number>('AUTH_DB_PORT'),
  username: configService.get<string>('AUTH_DB_USER'),
  password: configService.get<string>('AUTH_DB_PASSWORD'),
  database: configService.get<string>('AUTH_DB_NAME'),
  entities: [Auth, AuthToken],
  migrations: ['src/migrations/*.ts'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
});
