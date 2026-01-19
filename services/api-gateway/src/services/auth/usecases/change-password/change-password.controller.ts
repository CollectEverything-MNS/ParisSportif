import { Body, Controller, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './change-password.dto';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Auth')
@Controller()
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Put(routesConfig.auth.changePassword.path)
  @ApiOperation({ summary: "Changement de mot de passe d'un utilisateur" })
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.changePasswordService.execute(dto);
  }
}
