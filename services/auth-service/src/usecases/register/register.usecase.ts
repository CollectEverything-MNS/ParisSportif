import { ConflictException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Auth } from '../../entities/auth.entity';
import { IAuthRepository } from '../../repositories/auth.repository';
import { RegisterDto, RegisterResponseDto } from './register.dto';
import { hashPassword } from '../../shared/utils';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(dto: RegisterDto): Promise<RegisterResponseDto> {
    const existingAuth = await this.authRepo.findByEmail(dto.email);

    if (existingAuth) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = hashPassword(dto.password);

    const auth = new Auth({
      email: dto.email,
      password: hashedPassword,
    });

    const savedAuth = await this.authRepo.save(auth);

    return {
      id: savedAuth.id,
      email: savedAuth.email,
      createdAt: savedAuth.createdAt,
    };
  }
}
