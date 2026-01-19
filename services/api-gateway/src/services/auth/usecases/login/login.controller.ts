import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto } from './login.dto';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Auth')
@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post(routesConfig.auth.login.path)
  @ApiOperation({ summary: 'Connexion d\'un utilisateur' })
  async login(@Body() dto: LoginDto) {
    return this.loginService.execute(dto);
  }
}
