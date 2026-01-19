import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListMatchsController } from './usecases/list-matchs/list-matchs.controller';
import { TypeOrmMatchRepository } from './repositories/implements/match.impl.repository';
import { IMatchRepository } from './repositories/match.repository';
import { ListMatchsUsecase } from './usecases/list-matchs/list-matchs-usecase.service';
import { Match } from './entities/match.entity';
import { MatchSeed } from './seeds/match.seed';

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
        host: configService.get<string>('MATCH_DB_HOST'),
        port: configService.get<number>('MATCH_DB_PORT'),
        username: configService.get<string>('MATCH_DB_USER'),
        password: configService.get<string>('MATCH_DB_PASSWORD'),
        database: configService.get<string>('MATCH_DB_NAME'),
        entities: [Match],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Match]),
  ],
  controllers: [ListMatchsController],
  providers: [
    {
      provide: IMatchRepository,
      useClass: TypeOrmMatchRepository,
    },
    ListMatchsUsecase,
    MatchSeed,
  ],
})
export class AppModule {}
