import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Match } from '../entities/match.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('MATCH_DB_HOST'),
  port: configService.get<number>('MATCH_DB_PORT'),
  username: configService.get<string>('MATCH_DB_USER'),
  password: configService.get<string>('MATCH_DB_PASSWORD'),
  database: configService.get<string>('MATCH_DB_NAME'),
  entities: [Match],
  migrations: ['src/migrations/*.ts'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
});
