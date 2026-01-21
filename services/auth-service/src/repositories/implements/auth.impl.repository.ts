import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../../entities/auth.entity';
import { IAuthRepository } from '../auth.repository';

@Injectable()
export class TypeOrmAuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>,
  ) {}

  async save(auth: Auth): Promise<Auth> {
    return this.repository.save(auth);
  }

  async findByEmail(email: string): Promise<Auth | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Auth | null> {
    return this.repository.findOne({ where: { id } });
  }

  async softDeleteById(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
