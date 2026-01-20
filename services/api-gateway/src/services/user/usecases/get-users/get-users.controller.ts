import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { routesConfig } from '../../../../config/routes.config';
import { GetUsersService } from './get-users.service';

@ApiTags('User')
@Controller()
export class GetUsersController {
  constructor(private readonly getUsersService: GetUsersService) {}

  @Get(routesConfig.user.getUsers.path)
  @ApiOperation({ summary: 'Récupérer la liste des utilisateurs' })
  async getUsers() {
    return this.getUsersService.execute();
  }
}