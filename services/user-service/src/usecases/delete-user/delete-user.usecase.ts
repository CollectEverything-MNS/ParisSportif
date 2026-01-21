import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.deleteById(id);

    return {
      message: 'User deleted successfully',
    };
  }
}