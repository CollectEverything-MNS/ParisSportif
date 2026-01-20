import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute() {
    const users = await this.userRepo.list();

    return {
      message: 'Users fetched successfully',
      users,
    };
  }
}