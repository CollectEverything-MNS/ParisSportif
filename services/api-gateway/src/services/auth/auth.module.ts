import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LoginController } from './usecases/login/login.controller';
import { LoginService } from './usecases/login/login.service';
import { RegisterController } from './usecases/register/register.controller';
import { RegisterService } from './usecases/register/register.service';
import { RevokeTokenService } from './usecases/revoke-token/revoke-token.service';
import { RefreshTokenService } from './usecases/refresh-token/refresh-token.service';
import { RevokeTokenController } from './usecases/revoke-token/revoke-token.controller';
import { RefreshTokenController } from './usecases/refresh-token/refresh-token.controller';
import { ChangePasswordController } from './usecases/change-password/change-password.controller';
import { ChangePasswordService } from './usecases/change-password/change-password.service';
import { ForgetPasswordRequestService } from './usecases/forget-password-request/forget-password-request.service';
import { ForgetPasswordConfirmService } from './usecases/forget-password-confirm/forget-password-confirm.service';
import { ForgetPasswordRequestController } from './usecases/forget-password-request/forget-password-request.controller';
import { ForgetPasswordConfirmController } from './usecases/forget-password-confirm/forget-password-confirm.controller';
import { HttpProxyService } from '../../shared/services/http-proxy.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [
    LoginController,
    RegisterController,
    RevokeTokenController,
    RefreshTokenController,
    ChangePasswordController,
    ForgetPasswordRequestController,
    ForgetPasswordConfirmController,
  ],
  providers: [
    HttpProxyService,
    LoginService,
    RegisterService,
    RevokeTokenService,
    RefreshTokenService,
    ChangePasswordService,
    ForgetPasswordRequestService,
    ForgetPasswordConfirmService,
  ],
  exports: [
    LoginService,
    RegisterService,
    RevokeTokenService,
    RefreshTokenService,
    ChangePasswordService,
    ForgetPasswordRequestService,
    ForgetPasswordConfirmService,
  ],
})
export class AuthModule {}
