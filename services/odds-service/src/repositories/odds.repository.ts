import { Odds } from '../entities/odds.entity';

export abstract class IOddsRepository {
  abstract save(odds: Odds): Promise<Odds>;
  abstract findById(id: string): Promise<Odds | null>;
  abstract findByValue(value: number): Promise<Odds | null>;
  abstract softDelete(id: string): Promise<void>;
}
