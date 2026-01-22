import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { IWalletRepository } from '../wallet.repository';

@Injectable()
export class TypeOrmWalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly repository: Repository<Wallet>,
  ) {}

  async save(wallet: Wallet): Promise<Wallet> {
    return this.repository.save(wallet);
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByAuthId(authId: string): Promise<Wallet | null> {
    return this.repository.findOne({ where: { authId } });
  }

  async softDeleteById(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
