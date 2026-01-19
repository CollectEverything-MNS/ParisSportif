import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RevokeTokenService } from './revoke-token.service';
import { RevokeTokenDto } from './revoke-token.dto';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Auth')
@Controller()
export class RevokeTokenController {
  constructor(private readonly revokeTokenService: RevokeTokenService) {}

  @Post(routesConfig.auth.token.revoke.path)
  @ApiOperation({ summary: 'Suppression du token' })
  async revoke(@Body() dto: RevokeTokenDto) {
    return this.revokeTokenService.execute(dto);
  }
}
