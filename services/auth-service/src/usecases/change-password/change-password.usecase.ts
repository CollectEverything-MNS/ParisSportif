import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject
} from '@nestjs/common';
import { IAuthRepository } from '../../repositories/auth.repository';
import { ChangePasswordDto } from './change-password.dto';
import { hashPassword } from '../../shared/utils';
import { ClientProxy } from '@nestjs/microservices';
import {lastValueFrom} from "rxjs";

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

    const oldHashed = hashPassword(dto.oldPassword);

    if (auth.password !== oldHashed) {
      throw new BadRequestException('Invalid old password');
    }

    auth.password = hashPassword(dto.newPassword);
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
