import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IOddsRepository } from '../../repositories/odds.repository';
import { UpdateOddsDto, UpdateOddsResponseDto } from './update-odds.dto';

@Injectable()
export class UpdateOddsUseCase {
  constructor(private readonly oddsRepo: IOddsRepository) {}

  async execute(id: string, dto: UpdateOddsDto): Promise<UpdateOddsResponseDto> {
    const odds = await this.oddsRepo.findById(id);
    if (!odds) throw new NotFoundException('Odds not found');

    if (dto.value && dto.value !== odds.value) {
      const existing = await this.oddsRepo.findByValue(dto.value);
      if (existing && existing.id !== id) {
        throw new ConflictException('Odds value already exists');
      }
      odds.value = dto.value;
    }

    const saved = await this.oddsRepo.save(odds);

    return {
      id: saved.id,
      value: saved.value,
      updatedAt: saved.updatedAt,
    };
  }
}
