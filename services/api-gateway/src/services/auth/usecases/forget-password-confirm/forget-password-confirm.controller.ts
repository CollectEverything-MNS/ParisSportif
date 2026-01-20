import { Body, Controller, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { routesConfig } from '../../../../config/routes.config';
import { ForgetPasswordConfirmDto } from './forget-password-confirm.dto';
import { ForgetPasswordConfirmService } from './forget-password-confirm.service';

@ApiTags('Auth')
@Controller()
export class ForgetPasswordConfirmController {
  constructor(private readonly forgetPasswordConfirmService: ForgetPasswordConfirmService) {}

  @Put(routesConfig.auth.forgetPasswordConfirm.path)
  @ApiOperation({ summary: 'Mot de passe oublié confirmation' })
  async forgetPasswordConfirm(@Body() dto: ForgetPasswordConfirmDto) {
    return this.forgetPasswordConfirmService.execute(dto);
  }
}
