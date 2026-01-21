import { Controller, Get, Param } from '@nestjs/common';
import { oddsRoutes } from 'src/config/routes.config';
import { GetOddsByIdUseCase } from './get-odds-by-id.usecase';

@Controller(oddsRoutes.root)
export class GetOddsByIdController {
  constructor(private readonly getOddsByIdUseCase: GetOddsByIdUseCase) {}

  @Get(oddsRoutes.odds.getById)
  async getById(@Param('id') id: string) {
    return this.getOddsByIdUseCase.execute(id);
  }
}
