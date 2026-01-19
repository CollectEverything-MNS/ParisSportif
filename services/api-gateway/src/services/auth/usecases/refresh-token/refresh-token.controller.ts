import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenDto } from './refresh-token.dto';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Auth')
@Controller()
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post(routesConfig.auth.token.refresh.path)
  @ApiOperation({ summary: 'Rafraîchissement du token (MAJ expiredAt)' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenService.execute(dto);
  }
}
