import { Controller, Get } from '@nestjs/common';
import { ListMatchsUsecase } from './list-matchs-usecase.service';
import { matchRoutes } from '../../config/routes.config';

@Controller(matchRoutes.root)
export class ListMatchsController {
  constructor(private readonly listMatchsUseCase: ListMatchsUsecase) {}

  @Get()
  async listMatchs() {
    return this.listMatchsUseCase.execute();
  }
}
