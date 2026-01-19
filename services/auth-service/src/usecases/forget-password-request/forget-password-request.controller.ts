import { Body, Controller, Put } from '@nestjs/common';
import { ForgetPasswordRequestDto } from './forget-password-request.dto';
import { ForgetPasswordRequestUseCase } from './forget-password-request.usecase';
import { authRoutes } from '../../config/routes.config';

@Controller(authRoutes.root)
export class ForgetPasswordRequestController {
  constructor(
    private readonly useCase: ForgetPasswordRequestUseCase,
  ) {}

  @Put(authRoutes.auth.forgetPassword.request)
  async request(@Body() dto: ForgetPasswordRequestDto) {
    return this.useCase.execute(dto.email);
  }
}
