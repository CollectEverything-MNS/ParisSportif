import { Body, Controller, Post } from '@nestjs/common';
import { DepositUseCase } from './deposit.usecase';
import { DepositDto } from './deposit.dto';
import { walletRoutes } from '../../config/routes.config';

@Controller(walletRoutes.root)
export class DepositController {
  constructor(private readonly usecase: DepositUseCase) {}

  @Post(walletRoutes.wallet.deposit)
  async deposit(@Body() dto: DepositDto) {
    return this.usecase.execute(dto);
  }
}
