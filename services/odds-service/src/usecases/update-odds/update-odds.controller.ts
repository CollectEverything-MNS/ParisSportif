import { Body, Controller, Param, Patch } from '@nestjs/common';
import { oddsRoutes } from '../../config/routes.config';
import { UpdateOddsUseCase } from './update-odds.usecase';
import { UpdateOddsDto } from './update-odds.dto';

@Controller(oddsRoutes.root)
export class UpdateOddsController {
  constructor(private readonly updateOddsUseCase: UpdateOddsUseCase) {}

  @Patch(oddsRoutes.odds.update)
  async update(@Param('id') id: string, @Body() dto: UpdateOddsDto) {
    return this.updateOddsUseCase.execute(id, dto);
  }
}
