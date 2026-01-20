import { ConfigService } from '@nestjs/config';
import { Odds } from 'src/entities/odds.entity';
import { DataSource } from 'typeorm';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('ODDS_DB_HOST'),
  port: configService.get<number>('ODDS_DB_PORT'),
  username: configService.get<string>('ODDS_DB_USER'),
  password: configService.get<string>('ODDS_DB_PASSWORD'),
  database: configService.get<string>('ODDS_DB_NAME'),
  entities: [Odds],
  migrations: ['src/migrations/*.ts'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
});
