import { Controller, Get } from '@nestjs/common';
import { GetUsersUseCase } from './get-users.usecase';
import { usersRoutes } from '../../config/routes.config';
import { ApiOperation } from '@nestjs/swagger';

@Controller(usersRoutes.root)
export class GetUsersController {
  constructor(private readonly getUsersUseCase: GetUsersUseCase) {}

  @Get(usersRoutes.user.getAll)
  @ApiOperation({ summary: "Fetch des utilisateurs" })  
  async getUsers() {
    return this.getUsersUseCase.execute();
  }
}