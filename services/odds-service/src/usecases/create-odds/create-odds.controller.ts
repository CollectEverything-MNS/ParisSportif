import { Body, Controller, Post } from '@nestjs/common';
import { oddsRoutes } from '../../config/routes.config';
import { CreateOddsUseCase } from './create-odds.usecase';
import { CreateOddsDto } from './create-odds.dto';

@Controller(oddsRoutes.root)
export class CreateOddsController {
  constructor(private readonly createOddsUseCase: CreateOddsUseCase) {}

  @Post(oddsRoutes.odds.create)
  async create(@Body() dto: CreateOddsDto) {
    return this.createOddsUseCase.execute(dto);
  }
}
