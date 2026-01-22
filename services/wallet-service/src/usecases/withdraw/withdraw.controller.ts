import { Body, Controller, Post } from '@nestjs/common';
import { WithdrawUseCase } from './withdraw.usecase';
import { WithdrawDto } from './withdraw.dto';
import { walletRoutes } from '../../config/routes.config';

@Controller(walletRoutes.root)
export class WithdrawController {
  constructor(private readonly usecase: WithdrawUseCase) {}

  @Post(walletRoutes.wallet.withdraw)
  async withdraw(@Body() dto: WithdrawDto) {
    return this.usecase.execute(dto);
  }
}
