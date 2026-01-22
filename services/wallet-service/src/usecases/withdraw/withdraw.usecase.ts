import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Wallet } from '../../entities/wallet.entity';
import { WalletTransaction, WalletTransactionType } from '../../entities/wallet-transaction.entity';
import { WithdrawDto } from './withdraw.dto';
import { ClientProxy } from '@nestjs/microservices';
import { IWalletRepository } from '../../repositories/wallet.repository';
import { IWalletTransactionRepository } from '../../repositories/wallet-transaction.repository';

@Injectable()
export class WithdrawUseCase {
  constructor(
    private readonly walletRepo: IWalletRepository,
    private readonly walletTransactionRepo: IWalletTransactionRepository,
    @Inject('RMQ_CLIENT') private readonly rmq: ClientProxy,
  ) {}

  async execute(dto: WithdrawDto): Promise<{ walletId: string; balanceCents: number }> {
    const wallet = await this.walletRepo.findByAuthId(dto.authId);
    if (!wallet) throw new BadRequestException('Wallet not found for user');

    const current = wallet.balanceCents || 0;
    if (current < dto.amountCents) throw new BadRequestException('Insufficient funds');

    wallet.balanceCents = current - dto.amountCents;
    const savedWallet = await this.walletRepo.save(wallet);

    const transaction = new WalletTransaction({ walletId: savedWallet.id, type: WalletTransactionType.WITHDRAW, amountCents: dto.amountCents });
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
