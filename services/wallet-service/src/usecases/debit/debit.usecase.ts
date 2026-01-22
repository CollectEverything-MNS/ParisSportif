import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Wallet } from '../../entities/wallet.entity';
import { WalletTransaction, WalletTransactionType } from '../../entities/wallet-transaction.entity';
import { DebitDto } from './debit.dto';
import { ClientProxy } from '@nestjs/microservices';
import { IWalletRepository } from '../../repositories/wallet.repository';
import { IWalletTransactionRepository } from '../../repositories/wallet-transaction.repository';

@Injectable()
export class DebitUseCase {
  constructor(
    private readonly walletRepo: IWalletRepository,
    private readonly walletTransactionRepo: IWalletTransactionRepository,
    @Inject('RMQ_CLIENT') private readonly rmq: ClientProxy,
  ) {}

  async execute(dto: DebitDto): Promise<void> {
    const wallet = await this.walletRepo.findByAuthId(dto.authId);
    if (!wallet) throw new BadRequestException('Wallet not found for user');

    if (dto.betId) {
      const existing = await this.walletTransactionRepo.findByBetId(dto.betId, WalletTransactionType.BET);
      if (existing) return;
    }

    const current = wallet.balanceCents || 0;
    if (current < dto.stakeCents) throw new BadRequestException('Insufficient funds');

    wallet.balanceCents = current - dto.stakeCents;
    const savedWallet = await this.walletRepo.save(wallet);

    const transaction = new WalletTransaction({ walletId: savedWallet.id, betId: dto.betId ?? null, type: WalletTransactionType.BET, amountCents: dto.stakeCents });
    const savedTransaction = await this.walletTransactionRepo.save(transaction);

    try {
      this.rmq.emit('wallet.updated', { authId: dto.authId, walletId: savedWallet.id, balanceCents: savedWallet.balanceCents });
      this.rmq.emit('wallet.transaction.created', { id: savedTransaction.id, walletId: savedTransaction.walletId, betId: savedTransaction.betId, type: savedTransaction.type, amountCents: savedTransaction.amountCents, createdAt: savedTransaction.createdAt });
    } catch (e) {}
  }
}
