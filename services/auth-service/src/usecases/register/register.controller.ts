import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUseCase } from './register.usecase';
import { RegisterDto } from './register.dto';
import { authRoutes } from '../../config/routes.config';

@Controller(authRoutes.root)
export class RegisterController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post(authRoutes.auth.register)
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }
}
