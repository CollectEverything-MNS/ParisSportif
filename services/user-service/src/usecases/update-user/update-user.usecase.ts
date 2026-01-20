import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }


    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findByEmail(dto.email);
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
      user.email = dto.email;
    }


    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;


    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.address !== undefined) user.address = dto.address;
    if (dto.postaleCode !== undefined) user.postaleCode = dto.postaleCode;
    if (dto.city !== undefined) user.city = dto.city;
    if (dto.country !== undefined) user.country = dto.country;


    if (dto.role !== undefined) user.role = dto.role;

    await this.userRepo.save(user);

    return {
      message: 'User updated successfully',
    };
  }
}
