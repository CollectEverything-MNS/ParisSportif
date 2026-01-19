import { AuthToken } from '../entities/auth-token.entity';

export abstract class IAuthTokenRepository {
  abstract save(token: AuthToken): Promise<AuthToken>;
  abstract findByToken(token: string): Promise<AuthToken | null>;
  abstract findByAuthId(authId: string): Promise<AuthToken[]>;
  abstract deleteByAuthId(authId: string): Promise<void>;
  abstract deleteByToken(token: string): Promise<void>;
  abstract updateExpiredAt(token: string, expiredAt: Date): Promise<AuthToken | null>;
}
