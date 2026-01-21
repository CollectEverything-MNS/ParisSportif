import { Injectable, NotFoundException } from '@nestjs/common';
import { IOddsRepository } from 'src/repositories/odds.repository';

@Injectable()
export class DeleteOddsUseCase {
  constructor(private readonly oddsRepository: IOddsRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const odds = await this.oddsRepository.findById(id);

    if (!odds) throw new NotFoundException('Odds not found');

    await this.oddsRepository.softDelete(id);

    return { message: 'Odds delete successfully' };
  }
}
