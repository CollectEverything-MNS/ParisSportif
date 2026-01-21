import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { routesConfig } from '../../../../config/routes.config';
import { GetUserService } from './get-user.service';

@ApiTags('User')
@Controller()
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get(routesConfig.user.getUser.path)
  @ApiOperation({ summary: "Récupérer un utilisateur par son id" })
  async getUserById(@Param('id') id: string) {
    return this.getUserService.execute(id);
  }
}