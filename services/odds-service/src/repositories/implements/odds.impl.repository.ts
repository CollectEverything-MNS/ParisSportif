import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Odds } from '../../entities/odds.entity';
import { IOddsRepository } from '../odds.repository';

@Injectable()
export class TypeOrmOddsRepository implements IOddsRepository {
  constructor(
    @InjectRepository(Odds)
    private readonly repository: Repository<Odds>
  ) {}

  async save(odds: Odds): Promise<Odds> {
    return this.repository.save(odds);
  }
  async findById(id: string): Promise<Odds | null> {
    return this.repository.findOne({ where: { id } });
  }
  async findByValue(value: number): Promise<Odds | null> {
    return this.repository.findOne({ where: { value } });
  }
  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
