import { Injectable, Inject } from '@nestjs/common';
import { Wallet } from '../../entities/wallet.entity';
import { WalletTransaction, WalletTransactionType } from '../../entities/wallet-transaction.entity';
import { CreditDto } from './credit.dto';
import { ClientProxy } from '@nestjs/microservices';
import { IWalletRepository } from '../../repositories/wallet.repository';
import { IWalletTransactionRepository } from '../../repositories/wallet-transaction.repository';

@Injectable()
export class CreditUseCase {
  constructor(
    private readonly walletRepo: IWalletRepository,
    private readonly walletTransactionRepo: IWalletTransactionRepository,
    @Inject('RMQ_CLIENT') private readonly rmq: ClientProxy,
  ) {}

  async execute(dto: CreditDto): Promise<void> {
    if (dto.outcome === 'LOSS') return;
    if (dto.outcome === 'WIN' && !dto.winCents) return;

    if (dto.betId) {
      const existing = await this.walletTransactionRepo.findByBetId(dto.betId, WalletTransactionType.WIN);
      if (existing) return;
    }

    let wallet = await this.walletRepo.findByAuthId(dto.authId);
    if (!wallet) {
      wallet = new Wallet({ authId: dto.authId, balanceCents: 0, currency: 'EUR' });
      wallet = await this.walletRepo.save(wallet);
    }

    wallet.balanceCents = (wallet.balanceCents || 0) + (dto.winCents || 0);
    const savedWallet = await this.walletRepo.save(wallet);

    const transaction = new WalletTransaction({ walletId: savedWallet.id, betId: dto.betId ?? null, type: WalletTransactionType.WIN, amountCents: dto.winCents || 0 });
    const savedTransaction = await this.walletTransactionRepo.save(transaction);

    try {
      this.rmq.emit('wallet.updated', { authId: dto.authId, walletId: savedWallet.id, balanceCents: savedWallet.balanceCents });
      this.rmq.emit('wallet.transaction.created', { id: savedTransaction.id, walletId: savedTransaction.walletId, betId: savedTransaction.betId, type: savedTransaction.type, amountCents: savedTransaction.amountCents, createdAt: savedTransaction.createdAt });
    } catch (e) {}
  }
}
