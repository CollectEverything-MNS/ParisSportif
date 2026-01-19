import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from '../entities/match.entity';

@Injectable()
export class MatchSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>
  ) {}

  async onModuleInit() {
    const count = await this.matchRepository.count();
    if (count > 0) {
      console.log('⚠️ Matchs déjà existants');
      return;
    }

    const now = new Date();

    const matchs: Partial<Match>[] = [
      {
        equipeA: 'PSG',
        equipeB: 'OM',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // J+3
        location: 'Parc des Princes',
        status: MatchStatus.SCHEDULED,
        scoreA: null,
        scoreB: null,
      },
      {
        equipeA: 'Real Madrid',
        equipeB: 'FC Barcelone',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // J+5
        location: 'Santiago Bernabéu',
        status: MatchStatus.SCHEDULED,
        scoreA: null,
        scoreB: null,
      },
      {
        equipeA: 'Manchester City',
        equipeB: 'Liverpool',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // J+7
        location: 'Etihad Stadium',
        status: MatchStatus.SCHEDULED,
        scoreA: null,
        scoreB: null,
      },
    ];

    await this.matchRepository.save(matchs);
    console.log('✅ Matchs à venir seedés');
  }
}
