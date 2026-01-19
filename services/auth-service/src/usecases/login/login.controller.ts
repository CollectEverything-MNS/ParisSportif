import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from './login.usecase';
import { LoginDto } from './login.dto';
import { authRoutes } from '../../config/routes.config';

@Controller(authRoutes.root)
export class LoginController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post(authRoutes.auth.login)
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
