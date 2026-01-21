import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';
import { UpdateUserUseCase } from './update-user.usecase';
import { usersRoutes } from '../../config/routes.config';
import { ApiOperation } from '@nestjs/swagger';

@Controller(usersRoutes.root)
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Patch(usersRoutes.user.update)
  @ApiOperation({ summary: "Mise à jour d'un utilisateur" })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, dto);
  }
}
