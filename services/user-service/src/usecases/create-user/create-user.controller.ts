import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { CreateUserUseCase } from './create-user.usecase';
import { usersRoutes } from '../../config/routes.config';
import { ApiOperation } from '@nestjs/swagger';

@Controller(usersRoutes.root)
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post(usersRoutes.user.create)
@ApiOperation({ summary: "Creation d un utilisateur" })  

async createUser(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}
