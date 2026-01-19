import { Body, Controller, Post } from '@nestjs/common';
import { RefreshTokenUseCase } from './refresh-token.usecase';
import { RefreshTokenDto } from './refresh-token.dto';
import { authRoutes } from '../../config/routes.config';

@Controller(authRoutes.root)
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post(authRoutes.auth.refreshToken)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto);
  }
}
