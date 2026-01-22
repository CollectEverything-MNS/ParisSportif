import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletTransaction, WalletTransactionType } from '../../entities/wallet-transaction.entity';
import { IWalletTransactionRepository } from '../wallet-transaction.repository';

@Injectable()
export class TypeOrmWalletTransactionRepository implements IWalletTransactionRepository {
  constructor(
    @InjectRepository(WalletTransaction)
    private readonly repository: Repository<WalletTransaction>,
  ) {}

  async save(walletTransaction: WalletTransaction): Promise<WalletTransaction> {
    return this.repository.save(walletTransaction);
  }

  async findById(id: string): Promise<WalletTransaction | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByBetId(betId: string, type?: WalletTransactionType): Promise<WalletTransaction | null> {
    if (!betId) return null;
    const where: any = { betId };
    if (type) where.type = type;
    return this.repository.findOne({ where });
  }

  async softDeleteById(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
