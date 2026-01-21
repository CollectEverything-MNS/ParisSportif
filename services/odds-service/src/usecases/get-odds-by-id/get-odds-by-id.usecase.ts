import { Injectable, NotFoundException } from '@nestjs/common';
import { IOddsRepository } from '../../repositories/odds.repository';

@Injectable()
export class GetOddsByIdUseCase {
  constructor(private readonly oddsRepo: IOddsRepository) {}

  async execute(id: string) {
    const odds = await this.oddsRepo.findById(id);
    if (!odds) throw new NotFoundException('Odds not found');

    return odds;
  }
}
