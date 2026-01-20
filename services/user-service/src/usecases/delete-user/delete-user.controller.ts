import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.usecase';
import { usersRoutes } from '../../config/routes.config';
import { ApiOperation } from '@nestjs/swagger';

@Controller(usersRoutes.root)
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @Delete(usersRoutes.user.delete)
  @ApiOperation({ summary: "Suppression d un utilisateur" })  
  async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
