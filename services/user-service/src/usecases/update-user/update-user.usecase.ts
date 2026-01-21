import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { UpdateUserDto } from './update-user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

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

    return {
      message: 'User updated successfully',
    };
  }
}
