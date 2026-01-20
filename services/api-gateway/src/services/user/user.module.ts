import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { HttpProxyService } from '../../shared/services/http-proxy.service';

// ===== Create User =====
import { CreateUserController } from './usecases/create-user/create-user.controller';
import { CreateUserService } from './usecases/create-user/create-user.service';

// ===== Get One User =====
import { GetUserController } from './usecases/get-user/get-user.controller';
import { GetUserService } from './usecases/get-user/get-user.service';

// ===== Get Users =====
import { GetUsersController } from './usecases/get-users/get-users.controller';
import { GetUsersService } from './usecases/get-users/get-users.service';

// ===== Update User =====
import { UpdateUserController } from './usecases/update-user/update-user.controller';
import { UpdateUserService } from './usecases/update-user/update-user.service';

// ===== Delete User =====
import { DeleteUserController } from './usecases/delete-user/delete-user.controller';
import { DeleteUserService } from './usecases/delete-user/delete-user.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [
    CreateUserController,
    GetUserController,
    GetUsersController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    HttpProxyService,
    CreateUserService,
    GetUserService,
    GetUsersService,
    UpdateUserService,
    DeleteUserService,
  ],
  exports: [
    CreateUserService,
    GetUserService,
    GetUsersService,
    UpdateUserService,
    DeleteUserService,
  ],
})
export class UserModule {}