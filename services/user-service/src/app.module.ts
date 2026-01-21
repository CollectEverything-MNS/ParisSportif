import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { IUserRepository } from './repositories/user.repository';
import { TypeOrmUserRepository } from './repositories/implements/user.impl.repository';

import { CreateUserController } from './usecases/create-user/create-user.controller';
import { DeleteUserController } from './usecases/delete-user/delete-user.controller';
import { GetUserController } from './usecases/get-user/get-user.controller';
import { ListUsersController } from './usecases/list-users/list-users.controller';
import { UpdateUserController } from './usecases/update-user/update-user.controller';

import { CreateUserUseCase } from './usecases/create-user/create-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user/delete-user.usecase';
import { GetUserUseCase } from './usecases/get-user/get-user.usecase';
import { ListUsersUsecase } from './usecases/list-users/list-users.usecase';
import { UpdateUserUseCase } from './usecases/update-user/update-user.usecase';

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
        host: configService.get<string>('USER_DB_HOST'),
        port: configService.get<number>('USER_DB_PORT'),
        username: configService.get<string>('USER_DB_USER'),
        password: configService.get<string>('USER_DB_PASSWORD'),
        database: configService.get<string>('USER_DB_NAME'),
        entities: [User],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    TypeOrmModule.forFeature([User]),
  ],

  controllers: [
    CreateUserController,
    GetUserController,
    ListUsersController,
    UpdateUserController,
    DeleteUserController,
  ],

  providers: [
    {
      provide: IUserRepository,
      useClass: TypeOrmUserRepository,
    },

    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUsecase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class AppModule {}
