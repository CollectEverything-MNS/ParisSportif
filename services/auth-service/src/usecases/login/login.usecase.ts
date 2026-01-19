import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { AuthToken } from '../../entities/auth-token.entity';
import { IAuthRepository } from '../../repositories/auth.repository';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { LoginDto, LoginResponseDto } from './login.dto';
import { hashPassword } from '../../shared/utils';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly authTokenRepo: IAuthTokenRepository,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const auth = await this.authRepo.findByEmail(dto.email);

    if (!auth) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = hashPassword(dto.password);

    if (auth.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken();
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 24);

    const authToken = new AuthToken({
      authId: auth.id,
      token,
      expiredAt,
    });

    await this.authTokenRepo.save(authToken);

    return {
      token,
      expiredAt,
    };
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
