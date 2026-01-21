import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HttpProxyService } from '../../shared/services/http-proxy.service';
import { CreateUserController } from './usecases/create-user/create-user.controller';
import { CreateUserService } from './usecases/create-user/create-user.service';
import { GetUserController } from './usecases/get-user/get-user.controller';
import { GetUserService } from './usecases/get-user/get-user.service';
import { ListUsersController } from './usecases/list-users/list-users.controller';
import { ListUsersService } from './usecases/list-users/list-users.service';
import { UpdateUserController } from './usecases/update-user/update-user.controller';
import { UpdateUserService } from './usecases/update-user/update-user.service';
import { DeleteUserController } from './usecases/delete-user/delete-user.controller';
import { DeleteUserService } from './usecases/delete-user/delete-user.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [
    CreateUserController,
    GetUserController,
    ListUsersController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    HttpProxyService,
    CreateUserService,
    GetUserService,
    ListUsersService,
    UpdateUserService,
    DeleteUserService,
  ],
  exports: [
    CreateUserService,
    GetUserService,
    ListUsersService,
    UpdateUserService,
    DeleteUserService,
  ],
})
export class UserModule {}
