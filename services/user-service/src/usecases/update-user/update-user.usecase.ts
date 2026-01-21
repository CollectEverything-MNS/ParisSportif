import { Inject, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { UpdateUserDto } from './update-user.dto';
import { User } from '../../entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: IUserRepository, @Inject('RMQ_CLIENT') private rmq: ClientProxy) {}

  async execute(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userUpdated: User = {
      ...user,
      id: user.id,
      firstName: dto.firstName ?? user.firstName,
      lastName: dto.lastName ?? user.lastName,
      phone: dto.phone ?? user.phone,
      address: dto.address ?? user.address,
      postaleCode: dto.postaleCode ?? user.postaleCode,
      city: dto.city ?? user.city,
      country: dto.country ?? user.country,
      role: dto.role ?? user.role,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    };

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findByEmail(dto.email);
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
      userUpdated.email = dto.email;
    }

    await this.userRepo.save(userUpdated);

    await lastValueFrom(
      this.rmq.emit('user.updated', {    
      email: userUpdated.email,
      userId: userUpdated.id
    }),
  );


    return {
      message: 'User updated successfully',
    };
  }
}
