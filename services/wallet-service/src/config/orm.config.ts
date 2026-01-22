import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { WalletTransaction } from '../entities/wallet-transaction.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('WALLET_DB_HOST'),
  port: configService.get<number>('WALLET_DB_PORT'),
  username: configService.get<string>('WALLET_DB_USER'),
  password: configService.get<string>('WALLET_DB_PASSWORD'),
  database: configService.get<string>('WALLET_DB_NAME'),
  entities: [Wallet, WalletTransaction],
  migrations: ['src/migrations/*.ts'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
});
