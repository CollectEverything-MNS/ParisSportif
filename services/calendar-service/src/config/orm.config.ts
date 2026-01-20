import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Calendar } from '../entities/calendar.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('CALENDAR_DB_HOST'),
  port: configService.get<number>('CALENDAR_DB_PORT'),
  username: configService.get<string>('CALENDAR_DB_USER'),
  password: configService.get<string>('CALENDAR_DB_PASSWORD'),
  database: configService.get<string>('CALENDAR_DB_NAME'),
  entities: [Calendar],
  migrations: ['src/migrations/*.ts'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
});
