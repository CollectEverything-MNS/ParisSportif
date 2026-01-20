import { Controller, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { routesConfig } from '../../../../config/routes.config';
import { DeleteUserService } from './delete-user.service';

@ApiTags('User')
@Controller()
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(routesConfig.user.deleteUser.path)
  @ApiOperation({ summary: "Supprimer un utilisateur" })
  async deleteUser(@Param('id') id: string) {
    return this.deleteUserService.execute(id);
  }
}