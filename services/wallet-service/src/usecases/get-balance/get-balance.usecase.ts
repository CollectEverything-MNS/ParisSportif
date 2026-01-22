import { Injectable, Inject } from '@nestjs/common';
import { Wallet } from '../../entities/wallet.entity';
import { IWalletRepository } from '../../repositories/wallet.repository';
import { GetBalanceDto, GetBalanceResponseDto } from './get-balance.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    private readonly walletRepo: IWalletRepository,
    @Inject('RMQ_CLIENT') private rmq: ClientProxy,
  ) {}

  async execute(dto: GetBalanceDto): Promise<GetBalanceResponseDto> {
    let wallet = await this.walletRepo.findByAuthId(dto.authId);

    if (!wallet) {
      wallet = new Wallet({ authId: dto.authId, balanceCents: 0, currency: 'EUR' });
      wallet = await this.walletRepo.save(wallet);
    }

    return {
      id: wallet.id,
      authId: wallet.authId,
      currency: wallet.currency,
      balanceCents: wallet.balanceCents,
      updatedAt: wallet.updatedAt.toISOString(),
    };
  }
}
