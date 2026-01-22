import { Body, Controller, Post } from '@nestjs/common';
import { GetBalanceUseCase } from './get-balance.usecase';
import { GetBalanceDto } from './get-balance.dto';
import { walletRoutes } from '../../config/routes.config';

@Controller(walletRoutes.root)
export class GetBalanceController {
  constructor(
    private readonly getBalanceUseCase: GetBalanceUseCase,
  ) {}

  @Post(walletRoutes.wallet.balance)
  async register(@Body() dto: GetBalanceDto) {
    return this.getBalanceUseCase.execute(dto);
  }
}
