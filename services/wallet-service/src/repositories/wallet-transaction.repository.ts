import { WalletTransaction, WalletTransactionType } from '../entities/wallet-transaction.entity';

export abstract class IWalletTransactionRepository {
  abstract save(walletTransaction: WalletTransaction): Promise<WalletTransaction>;
  abstract findById(id: string): Promise<WalletTransaction | null>;
  abstract findByBetId(betId: string, type?: WalletTransactionType): Promise<WalletTransaction | null>;
  abstract softDeleteById(id: string): Promise<void>;
}
