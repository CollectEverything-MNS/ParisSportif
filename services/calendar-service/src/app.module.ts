import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { ICalendarRepository } from './repositories/calendar.repository';
import { TypeOrmCalendarRepository } from './repositories/implements/calendar.impl.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('CALENDAR_DB_HOST'),
        port: configService.get<number>('CALENDAR_DB_PORT'),
        username: configService.get<string>('CALENDAR_DB_USER'),
        password: configService.get<string>('CALENDAR_DB_PASSWORD'),
        database: configService.get<string>('CALENDAR_DB_NAME'),
        entities: [Calendar],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Calendar]),
  ],
  controllers: [],
  providers: [
    {
      provide: ICalendarRepository,
      useClass: TypeOrmCalendarRepository,
    },
  ],
})
export class AppModule {}
