import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GetBalanceController } from './usecases/get-balance/get-balance.controller';
import { GetBalanceService } from './usecases/get-balance/get-balance.service';
import { DepositController } from './usecases/deposit/deposit.controller';
import { DepositService } from './usecases/deposit/deposit.service';
import { WithdrawController } from './usecases/withdraw/withdraw.controller';
import { WithdrawService } from './usecases/withdraw/withdraw.service';
import { ListTransactionsController } from './usecases/list-transactions/list-transactions.controller';
import { ListTransactionsService } from './usecases/list-transactions/list-transactions.service';
import { HttpProxyService } from '../../shared/services/http-proxy.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [
    GetBalanceController,
    DepositController,
    WithdrawController,
    ListTransactionsController,
  ],
  providers: [
    HttpProxyService,
    GetBalanceService,
    DepositService,
    WithdrawService,
    ListTransactionsService,
  ],
  exports: [
    GetBalanceService,
    DepositService,
    WithdrawService,
    ListTransactionsService,
  ],
})
export class WalletModule {}
