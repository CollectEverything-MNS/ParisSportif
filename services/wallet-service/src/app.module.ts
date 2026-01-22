import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { IWalletRepository } from './repositories/wallet.repository';
import { IWalletTransactionRepository } from './repositories/wallet-transaction.repository';
import { TypeOrmWalletRepository } from './repositories/implements/wallet.impl.repository';
import { TypeOrmWalletTransactionRepository } from './repositories/implements/wallet-transaction.impl.repository';
import { GetBalanceController } from './usecases/get-balance/get-balance.controller';
import { GetBalanceUseCase } from './usecases/get-balance/get-balance.usecase';
import { CreditUseCase } from './usecases/credit/credit.usecase';
import { DebitUseCase } from './usecases/debit/debit.usecase';
import { DepositController } from './usecases/deposit/deposit.controller';
import { DepositUseCase } from './usecases/deposit/deposit.usecase';
import { WithdrawController } from './usecases/withdraw/withdraw.controller';
import { WithdrawUseCase } from './usecases/withdraw/withdraw.usecase';
import { CreditEventsListener } from './usecases/credit/credit.events';
import { DebitEventsListener } from './usecases/debit/debit.events';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('WALLET_DB_HOST'),
        port: configService.get<number>('WALLET_DB_PORT'),
        username: configService.get<string>('WALLET_DB_USER'),
        password: configService.get<string>('WALLET_DB_PASSWORD'),
        database: configService.get<string>('WALLET_DB_NAME'),
        entities: [Wallet, WalletTransaction],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
    ClientsModule.registerAsync([
      {
        name: 'RMQ_CLIENT',
        useFactory: (cfg: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [cfg.get<string>('RABBITMQ_URL')!],
            queue: 'wallet_events',
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [GetBalanceController, DepositController, WithdrawController, CreditEventsListener, DebitEventsListener],
  providers: [
    {
      provide: IWalletRepository,
      useClass: TypeOrmWalletRepository,
    },
    {
      provide: IWalletTransactionRepository,
      useClass: TypeOrmWalletTransactionRepository,
    },
    GetBalanceUseCase,
    CreditUseCase,
    DebitUseCase,
    GetBalanceUseCase,
    CreditUseCase,
    DebitUseCase,
    DepositUseCase,
    WithdrawUseCase,
  ],
})
export class AppModule {}
