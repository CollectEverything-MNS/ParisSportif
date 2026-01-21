import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthRepository } from '../../repositories/auth.repository';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { ForgetPasswordConfirmDto } from './forget-password-confirm.dto';
import { hashPassword } from '../../shared/utils';

@Injectable()
export class ForgetPasswordConfirmUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly tokenRepo: IAuthTokenRepository
  ) {}

  async execute(dto: ForgetPasswordConfirmDto) {
    const auth = await this.authRepo.findByEmail(dto.email);

    if (!auth) {
      throw new NotFoundException('User not found');
    }

    const tokenValue = `OTP_${dto.otp}`;

    const token = await this.tokenRepo.findByToken(tokenValue);

    if (!token || token.authId !== auth.id) {
      throw new BadRequestException('Invalid OTP');
    }

    if (token.expiredAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    auth.password = await hashPassword(dto.newPassword);
    await this.authRepo.save(auth);

    await this.tokenRepo.deleteByToken(tokenValue);

    return {
      message: 'Password reset successfully',
    };
  }
}
