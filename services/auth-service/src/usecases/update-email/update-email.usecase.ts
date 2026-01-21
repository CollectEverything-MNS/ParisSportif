import { Injectable, ConflictException } from '@nestjs/common';
import { IAuthRepository } from '../../repositories/auth.repository';
import { UpdateEmailDto } from './update-email.dto';

@Injectable()
export class UpdateEmailUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
  ) {}

  async execute(dto: UpdateEmailDto): Promise<void> {
    const auth = await this.authRepo.findById(dto.authId);
    if (!auth) {
      throw new Error('User not found');
    }

    const existingAuth = await this.authRepo.findByEmail(dto.newEmail);
    if (existingAuth) {
      throw new ConflictException('Email already exists');
    }

    auth.email = dto.newEmail;

    await this.authRepo.save(auth);
  }
}
