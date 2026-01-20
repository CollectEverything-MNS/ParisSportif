import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Auth } from './entities/auth.entity';
import { AuthToken } from './entities/auth-token.entity';
import { IAuthRepository } from './repositories/auth.repository';
import { IAuthTokenRepository } from './repositories/auth-token.repository';
import { TypeOrmAuthRepository } from './repositories/implements/auth.impl.repository';
import { TypeOrmAuthTokenRepository } from './repositories/implements/auth-token.impl.repository';
import { LoginUseCase } from './usecases/login/login.usecase';
import { RegisterUseCase } from './usecases/register/register.usecase';
import { RegisterController } from './usecases/register/register.controller';
import { LoginController } from './usecases/login/login.controller';
import { RevokeTokenUseCase } from './usecases/revoke-token/revoke-token.usecase';
import { RevokeTokenController } from './usecases/revoke-token/revoke-token.controller';
import { RefreshTokenUseCase } from './usecases/refresh-token/refresh-token.usecase';
import { RefreshTokenController } from './usecases/refresh-token/refresh-token.controller';
import { ChangePasswordController } from './usecases/change-password/change-password.controller';
import { ChangePasswordUseCase } from './usecases/change-password/change-password.usecase';
import { ForgetPasswordRequestUseCase } from './usecases/forget-password-request/forget-password-request.usecase';
import { ForgetPasswordConfirmController } from './usecases/forget-password-confirm/forget-password-confirm.controller';
import { ForgetPasswordRequestController } from './usecases/forget-password-request/forget-password-request.controller';
import { ForgetPasswordConfirmUseCase } from './usecases/forget-password-confirm/forget-password-confirm.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('AUTH_DB_HOST'),
        port: configService.get<number>('AUTH_DB_PORT'),
        username: configService.get<string>('AUTH_DB_USER'),
        password: configService.get<string>('AUTH_DB_PASSWORD'),
        database: configService.get<string>('AUTH_DB_NAME'),
        entities: [Auth, AuthToken],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Auth, AuthToken]),
    ClientsModule.registerAsync([
      { name: 'RMQ_CLIENT', useFactory: (cfg: ConfigService) => ({ transport: Transport.RMQ, options: { urls: [cfg.get<string>('RABBITMQ_URL')!], queue: 'auth_events', queueOptions: { durable: true } } }), inject: [ConfigService] }
    ]),
  ],
  controllers: [
    RegisterController,
    LoginController,
    RevokeTokenController,
    RefreshTokenController,
    ChangePasswordController,
    ForgetPasswordRequestController,
    ForgetPasswordConfirmController,
  ],
  providers: [
    {
      provide: IAuthRepository,
      useClass: TypeOrmAuthRepository,
    },
    {
      provide: IAuthTokenRepository,
      useClass: TypeOrmAuthTokenRepository,
    },
    RegisterUseCase,
    LoginUseCase,
    RevokeTokenUseCase,
    RefreshTokenUseCase,
    ChangePasswordUseCase,
    ForgetPasswordRequestUseCase,
    ForgetPasswordConfirmUseCase
  ],
})
export class AppModule {}
