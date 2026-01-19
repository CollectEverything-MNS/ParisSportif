import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ListMatchsController } from './usecases/list-matchs/list-matchs.controller';
import { ListMatchsService } from './usecases/list-matchs/list-matchs.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [ListMatchsController],
  providers: [ListMatchsService],
  exports: [ListMatchsService],
})
export class MatchModule {}
