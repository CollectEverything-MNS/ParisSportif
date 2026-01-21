import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('USER_DB_HOST'),
  port: configService.get<number>('USER_DB_PORT'),
  username: configService.get<string>('USER_DB_USER'),
  password: configService.get<string>('USER_DB_PASSWORD'),
  database: configService.get<string>('USER_DB_NAME'),
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
});