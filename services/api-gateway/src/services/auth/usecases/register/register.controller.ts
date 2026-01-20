import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { RegisterDto } from './register.dto';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Auth')
@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post(routesConfig.auth.register.path)
  @ApiOperation({ summary: "Inscription d'un utilisateur" })
  async register(@Body() dto: RegisterDto) {
    return this.registerService.execute(dto);
  }
}
