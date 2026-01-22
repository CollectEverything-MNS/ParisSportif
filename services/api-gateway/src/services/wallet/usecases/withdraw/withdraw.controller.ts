import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WithdrawService } from './withdraw.service';
import { WithdrawDto } from './withdraw.dto';
import { routesConfig } from '../../../../config/routes.config';
import { Request } from 'express';

@ApiTags('Wallet')
@Controller()
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post(routesConfig.wallet.withdraw.path)
  @ApiOperation({ summary: "Retirer de l'argent du portefeuille (en centimes d'euros)" })
  async withdraw(@Req() req: Request, @Body() dto: WithdrawDto) {
    const userId = (req as any).user?.authId || (req as any).user?.id || req.headers['x-user-id'];
    if (typeof userId === 'string') dto.authId = userId;
    return this.withdrawService.execute(dto);
  }
}
