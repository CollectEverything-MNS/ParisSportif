import { Controller, Get, Param } from '@nestjs/common';
import { GetUserUseCase } from './get-user.usecase';
import { usersRoutes } from '../../config/routes.config';
import { ApiOperation } from '@nestjs/swagger';

@Controller(usersRoutes.root)
export class GetUserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get(usersRoutes.user.getOne)
  @ApiOperation({ summary: "Fetch un utilisateur" })  
  async getUser(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }
}