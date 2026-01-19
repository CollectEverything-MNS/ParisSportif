import { Match } from '../entities/match.entity';

export abstract class IMatchRepository {
  abstract list(): Promise<Match[]>;
}
