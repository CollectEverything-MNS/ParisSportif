import { Body, Controller, Post } from '@nestjs/common';
import { RevokeTokenUseCase } from './revoke-token.usecase';
import { RevokeTokenDto } from './revoke-token.dto';
import { authRoutes } from '../../config/routes.config';

@Controller(authRoutes.root)
export class RevokeTokenController {
  constructor(private readonly revokeTokenUseCase: RevokeTokenUseCase) {}

  @Post(authRoutes.auth.revokeToken)
  async revoke(@Body() dto: RevokeTokenDto) {
    return this.revokeTokenUseCase.execute(dto);
  }
}
