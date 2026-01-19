import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, } from '@nestjs/common';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { RefreshTokenDto, RefreshTokenResponseDto } from './refresh-token.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authTokenRepo: IAuthTokenRepository) {}

  async execute(dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const authToken = await this.authTokenRepo.findByToken(dto.token);

    if (!authToken) {
      throw new NotFoundException('Token not found');
    }

    if (new Date() > authToken.expiredAt) {
      throw new UnauthorizedException('Token expired');
    }

    const newExpiredAt = new Date();
    newExpiredAt.setHours(newExpiredAt.getHours() + 24);

    const updatedToken = await this.authTokenRepo.updateExpiredAt(
      dto.token,
      newExpiredAt,
    );

    if (!updatedToken) {
      throw new BadRequestException('Invalid token');
    }

    return {
      token: updatedToken.token,
      expiredAt: updatedToken.expiredAt,
    };
  }
}
