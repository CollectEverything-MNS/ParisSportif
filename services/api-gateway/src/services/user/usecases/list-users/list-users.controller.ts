import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { routesConfig } from '../../../../config/routes.config';
import { ListUsersService } from './list-users.service';

@ApiTags('User')
@Controller()
export class ListUsersController {
  constructor(private readonly getUsersService: ListUsersService) {}

  @Get(routesConfig.user.getUsers.path)
  @ApiOperation({ summary: 'Récupérer la liste des utilisateurs' })
  async getUsers() {
    return this.getUsersService.execute();
  }
}
