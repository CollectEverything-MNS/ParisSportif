import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { Auth } from '../../entities/auth.entity';
import { IAuthRepository } from '../../repositories/auth.repository';
import { RegisterDto, RegisterResponseDto } from './register.dto';
import { hashPassword } from '../../shared/utils';
import { ClientProxy } from '@nestjs/microservices';
import {lastValueFrom} from "rxjs";

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
    @Inject('RMQ_CLIENT') private rmq: ClientProxy
  ) {}

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

    await lastValueFrom(
      this.rmq.emit('auth.registered', {
        authId: savedAuth.id,
        email: savedAuth.email,
      })
    );

    return {
      id: savedAuth.id,
      email: savedAuth.email,
      createdAt: savedAuth.createdAt,
    };
  }
}
