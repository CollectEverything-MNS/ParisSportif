import { Body, Controller, Put } from '@nestjs/common';
import { ChangePasswordDto } from './change-password.dto';
import { ChangePasswordUseCase } from './change-password.usecase';
import { authRoutes } from '../../config/routes.config';

@Controller(authRoutes.root)
export class ChangePasswordController {
  constructor(
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Put(authRoutes.auth.changePassword)
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.changePasswordUseCase.execute(dto);
  }
}
