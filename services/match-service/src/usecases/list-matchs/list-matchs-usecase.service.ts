import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IMatchRepository } from '../../repositories/match.repository';

@Injectable()
export class ListMatchsUsecase {
  constructor(private readonly matchRepo: IMatchRepository) {}

  async execute() {
    const matchs = await this.matchRepo.list();

    if (!matchs || matchs.length === 0) {
      throw new UnauthorizedException('Match not found');
    }

    return matchs;
  }
}
