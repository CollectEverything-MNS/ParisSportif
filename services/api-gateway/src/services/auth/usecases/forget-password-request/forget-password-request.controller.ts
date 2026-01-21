import { Body, Controller, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgetPasswordRequestService } from './forget-password-request.service';
import { ForgetPasswordRequestDto } from './forget-password-request.dto';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Auth')
@Controller()
export class ForgetPasswordRequestController {
  constructor(private readonly forgetPasswordRequestService: ForgetPasswordRequestService) {}

  @Put(routesConfig.auth.forgetPasswordRequest.path)
  @ApiOperation({ summary: 'Mot de passe oublié demande' })
  async forgetPasswordRequest(@Body() dto: ForgetPasswordRequestDto) {
    return this.forgetPasswordRequestService.execute(dto);
  }
}
