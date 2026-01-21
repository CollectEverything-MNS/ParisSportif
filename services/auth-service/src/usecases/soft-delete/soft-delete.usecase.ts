import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../repositories/auth.repository';
import { SoftDeleteDto } from './soft-delete.dto';

@Injectable()
export class SoftDeleteUseCase {
  constructor(
    private readonly authRepo: IAuthRepository,
  ) {}

  async execute(dto: SoftDeleteDto): Promise<void> {
    await this.authRepo.softDeleteById(dto.authId);
  }
}
