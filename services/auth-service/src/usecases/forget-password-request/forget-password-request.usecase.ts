import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuthRepository } from '../../repositories/auth.repository';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { AuthToken } from '../../entities/auth-token.entity';

@Injectable()
export class ForgetPasswordRequestUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly tokenRepo: IAuthTokenRepository,
  ) {}

  async execute(email: string) {
    const auth = await this.authRepo.findByEmail(email);

    if (!auth) {
      throw new NotFoundException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.tokenRepo.save(
      new AuthToken({
        authId: auth.id,
        token: `OTP_${otp}`,
        expiredAt: new Date(Date.now() + 1000 * 60 * 10), // 10 min
      }),
    );

    // envoie du code par email
    console.log(`OTP ${otp} - email ${email}`);

    return {
      message: 'OTP sent to email',
    };
  }
}
