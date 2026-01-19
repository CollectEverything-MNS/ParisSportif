import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMatchRepository } from '../match.repository';
import { Match } from '../../entities/match.entity';

@Injectable()
export class TypeOrmMatchRepository implements IMatchRepository {
  constructor(
    @InjectRepository(Match)
    private readonly repository: Repository<Match>
  ) {}

  async list(): Promise<Match[]> {
    return this.repository.find();
  }
}
