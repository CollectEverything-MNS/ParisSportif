import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Odds } from './entities/odds.entity';
import { UpdateOddsController } from './usecases/update-odds/update-odds.controller';
import { CreateOddsController } from './usecases/create-odds/create-odds.controller';
import { GetOddsByIdController } from './usecases/get-odds-by-id/get-odds-by-id.controller';
import { DeleteOddsController } from './usecases/delete-odds/delete-odds.controller';
import { IOddsRepository } from './repositories/odds.repository';
import { TypeOrmOddsRepository } from './repositories/implements/odds.impl.repository';
import { CreateOddsUseCase } from './usecases/create-odds/create-odds.usecase';
import { GetOddsByIdUseCase } from './usecases/get-odds-by-id/get-odds-by-id.usecase';
import { UpdateOddsUseCase } from './usecases/update-odds/update-odds.usecase';
import { DeleteOddsUseCase } from './usecases/delete-odds/delete-odds.usecase';

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
        host: configService.get<string>('ODDS_DB_HOST'),
        port: configService.get<number>('ODDS_DB_PORT'),
        username: configService.get<string>('ODDS_DB_USER'),
        password: configService.get<string>('ODDS_DB_PASSWORD'),
        database: configService.get<string>('ODDS_DB_NAME'),
        entities: [Odds],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Odds]),
  ],
  controllers: [
    CreateOddsController,
    GetOddsByIdController,
    UpdateOddsController,
    DeleteOddsController,
  ],
  providers: [
    {
      provide: IOddsRepository,
      useClass: TypeOrmOddsRepository,
    },
    CreateOddsUseCase,
    GetOddsByIdUseCase,
    UpdateOddsUseCase,
    DeleteOddsUseCase,
  ],
})
export class AppModule {}
