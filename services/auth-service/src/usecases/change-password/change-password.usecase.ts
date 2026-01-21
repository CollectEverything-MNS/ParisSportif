import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthRepository } from '../../repositories/auth.repository';
import { ChangePasswordDto } from './change-password.dto';
import { comparePassword, hashPassword } from '../../shared/utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    @Inject('RMQ_CLIENT') private rmq: ClientProxy
  ) {}

  async execute(dto: ChangePasswordDto) {
    const auth = await this.authRepo.findById(dto.authId);

    if (!auth) {
      throw new NotFoundException('User not found');
    }

    const isOldValid = await comparePassword(dto.oldPassword, auth.password);

    if (!isOldValid) {
      throw new BadRequestException('Invalid old password');
    }

    auth.password = await hashPassword(dto.newPassword);
    await this.authRepo.save(auth);

    await lastValueFrom(
      this.rmq.emit('password.changed', {
        authId: auth.id,
        password: auth.password,
      })
    );

    return {
      message: 'Password changed successfully',
    };
  }
}
