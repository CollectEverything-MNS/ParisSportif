import { ConflictException, Injectable } from '@nestjs/common';
import { IOddsRepository } from '../../repositories/odds.repository';
import { Odds } from '../../entities/odds.entity';
import { CreateOddsDto, CreateOddsResponseDto } from './create-odds.dto';

@Injectable()
export class CreateOddsUseCase {
  constructor(private readonly oddsRepo: IOddsRepository) {}

  async execute(dto: CreateOddsDto): Promise<CreateOddsResponseDto> {
    const existing = await this.oddsRepo.findByValue(dto.value);
    if (existing) {
      throw new ConflictException('Odds value already exists');
    }

    const odds = new Odds({ value: dto.value });
    const saved = await this.oddsRepo.save(odds);

    return {
      id: saved.id,
      value: saved.value,
      createdAt: saved.createdAt,
    };
  }
}
