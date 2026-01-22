import { Injectable, Inject } from '@nestjs/common';
import { Wallet } from '../../entities/wallet.entity';
import { WalletTransaction, WalletTransactionType } from '../../entities/wallet-transaction.entity';
import { DepositDto } from './deposit.dto';
import { ClientProxy } from '@nestjs/microservices';
import { IWalletRepository } from '../../repositories/wallet.repository';
import { IWalletTransactionRepository } from '../../repositories/wallet-transaction.repository';

@Injectable()
export class DepositUseCase {
  constructor(
    private readonly walletRepo: IWalletRepository,
    private readonly walletTransactionRepo: IWalletTransactionRepository,
    @Inject('RMQ_CLIENT') private readonly rmq: ClientProxy,
  ) {}

  async execute(dto: DepositDto): Promise<{ walletId: string; balanceCents: number }> {
    let wallet = await this.walletRepo.findByAuthId(dto.authId);
    if (!wallet) {
      wallet = new Wallet({ authId: dto.authId, balanceCents: 0, currency: 'EUR' });
    }

    wallet.balanceCents = (wallet.balanceCents || 0) + dto.amountCents;
    const savedWallet = await this.walletRepo.save(wallet);

    const transaction = new WalletTransaction({ walletId: savedWallet.id, type: WalletTransactionType.DEPOSIT, amountCents: dto.amountCents });
    const savedTransaction = await this.walletTransactionRepo.save(transaction);

    const result = { walletId: savedWallet.id, balanceCents: savedWallet.balanceCents };

    try {
      this.rmq.emit('wallet.updated', { authId: dto.authId, ...result });
      this.rmq.emit('wallet.transaction.created', { id: savedTransaction.id, walletId: savedTransaction.walletId, betId: savedTransaction.betId, type: savedTransaction.type, amountCents: savedTransaction.amountCents, createdAt: savedTransaction.createdAt });
    } catch (e) {
    }

    return result;
  }
}
