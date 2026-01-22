import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepositService } from './deposit.service';
import { DepositDto } from './deposit.dto';
import { routesConfig } from '../../../../config/routes.config';
import { Request } from 'express';

@ApiTags('Wallet')
@Controller()
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post(routesConfig.wallet.deposit.path)
  @ApiOperation({ summary: "Déposer de l'argent sur le portefeuille (en centimes d'euros)" })
  async deposit(@Req() req: Request, @Body() dto: DepositDto) {
    const userId = (req as any).user?.authId || (req as any).user?.id || req.headers['x-user-id'];
    if (typeof userId === 'string') dto.authId = userId;
    return this.depositService.execute(dto);
  }
}
