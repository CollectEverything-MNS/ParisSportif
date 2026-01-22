import { Wallet } from '../entities/wallet.entity';

export abstract class IWalletRepository {
  abstract save(wallet: Wallet): Promise<Wallet>;
  abstract findById(id: string): Promise<Wallet | null>;
  abstract findByAuthId(authId: string): Promise<Wallet | null>;
  abstract softDeleteById(id: string): Promise<void>;
}
