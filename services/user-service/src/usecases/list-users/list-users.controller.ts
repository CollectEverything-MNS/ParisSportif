import { Controller, Get } from '@nestjs/common';
import { ListUsersUsecase } from './list-users.usecase';
import { usersRoutes } from '../../config/routes.config';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class ListUsersController {
  constructor(private readonly getUsersUseCase: ListUsersUsecase) {}

  @Get(usersRoutes.root)
  @ApiOperation({ summary: 'Liste des utilisateurs' })
  async getUsers() {
    return this.getUsersUseCase.execute();
  }
}
