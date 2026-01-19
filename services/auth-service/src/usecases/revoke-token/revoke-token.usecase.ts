import { Injectable, NotFoundException } from '@nestjs/common';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { RevokeTokenDto } from './revoke-token.dto';

@Injectable()
export class RevokeTokenUseCase {
  constructor(private readonly authTokenRepo: IAuthTokenRepository) {}

  async execute(dto: RevokeTokenDto): Promise<{ message: string }> {
    const token = await this.authTokenRepo.findByToken(dto.token);

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    await this.authTokenRepo.deleteByToken(dto.token);

    return { message: 'Token revoked successfully' };
  }
}
