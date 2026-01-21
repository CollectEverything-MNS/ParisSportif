import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepo: IUserRepository, @Inject('RMQ_CLIENT') private rmq: ClientProxy) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.deleteById(id);

    await lastValueFrom(
      this.rmq.emit('user.deleted', {
      userId: id,
    }),
  );


    return {
      message: 'User deleted successfully',
    };
  }
}