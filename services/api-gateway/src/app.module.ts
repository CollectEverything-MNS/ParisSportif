import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './services/auth/auth.module';
import { MatchModule } from './services/match/match.module';
import { CalendarModule } from './services/calendar/calendar.module';
import { OddsModule } from './services/odds/odds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CalendarModule,
    MatchModule,
    OddsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
