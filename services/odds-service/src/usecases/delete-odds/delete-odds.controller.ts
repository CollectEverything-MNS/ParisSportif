import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { oddsRoutes } from '../../config/routes.config';
import { DeleteOddsUseCase } from './delete-odds.usecase';

@Controller(oddsRoutes.root)
export class DeleteOddsController {
  constructor(private readonly deleteOddsUseCase: DeleteOddsUseCase) {}

  @Delete(oddsRoutes.odds.delete)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.deleteOddsUseCase.execute(id);
  }
}
