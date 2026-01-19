import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { IAuthRepository } from '../../repositories/auth.repository';
import { ChangePasswordDto } from './change-password.dto';
import { hashPassword } from '../../shared/utils';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
  ) {}

  async execute(dto: ChangePasswordDto) {
    const auth = await this.authRepo.findById(dto.authId);

    if (!auth) {
      throw new NotFoundException('User not found');
    }

    const oldHashed = hashPassword(dto.oldPassword);

    if (auth.password !== oldHashed) {
      throw new BadRequestException('Invalid old password');
    }

    auth.password = hashPassword(dto.newPassword);
    await this.authRepo.save(auth);

    return {
      message: 'Password changed successfully',
    };
  }
}
