import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from '../../entities/auth-token.entity';
import { IAuthTokenRepository } from '../auth-token.repository';

@Injectable()
export class TypeOrmAuthTokenRepository implements IAuthTokenRepository {
  constructor(
    @InjectRepository(AuthToken)
    private readonly repository: Repository<AuthToken>,
  ) {}

  async save(token: AuthToken): Promise<AuthToken> {
    return this.repository.save(token);
  }

  async findByToken(token: string): Promise<AuthToken | null> {
    return this.repository.findOne({ where: { token } });
  }

  async findByAuthId(authId: string): Promise<AuthToken[]> {
    return this.repository.find({ where: { authId } });
  }

  async deleteByAuthId(authId: string): Promise<void> {
    await this.repository.delete({ authId });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.repository.delete({ token });
  }

  async updateExpiredAt(token: string, expiredAt: Date): Promise<AuthToken | null> {
    await this.repository.update({ token }, { expiredAt });
    return this.repository.findOne({ where: { token } });
  }
}
