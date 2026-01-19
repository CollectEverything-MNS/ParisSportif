import { Body, Controller, Put } from '@nestjs/common';
import { ForgetPasswordConfirmDto } from './forget-password-confirm.dto';
import { ForgetPasswordConfirmUseCase } from './forget-password-confirm.usecase';
import { authRoutes } from '../../config/routes.config';

@Controller(authRoutes.root)
export class ForgetPasswordConfirmController {
  constructor(
    private readonly forgetPasswordUseCase: ForgetPasswordConfirmUseCase,
  ) {}

  @Put(authRoutes.auth.forgetPassword.confirm)
  async confirm(@Body() dto: ForgetPasswordConfirmDto) {
    return this.forgetPasswordUseCase.execute(dto);
  }
}
