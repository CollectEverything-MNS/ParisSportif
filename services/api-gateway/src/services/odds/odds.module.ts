import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CreateOddsController } from './usecases/create-odds/create-odds.controller';
import { CreateOddsService } from './usecases/create-odds/create-odds.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [CreateOddsController],
  providers: [CreateOddsService],
  exports: [CreateOddsService],
})
export class OddsModule {}
