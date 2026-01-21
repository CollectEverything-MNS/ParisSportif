import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { routesConfig } from '../../../../config/routes.config';
import { CreateUserService } from './create-user.service';
import { CreateUserDto } from './create-user.dto';

@ApiTags('User')
@Controller()
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post(routesConfig.user.createUser.path)
  @ApiOperation({ summary: "Création d'un utilisateur" })
  async createUser(@Body() dto: CreateUserDto) {
    return this.createUserService.execute(dto);
  }
}
