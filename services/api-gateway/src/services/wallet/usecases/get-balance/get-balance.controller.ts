import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBalanceService } from './get-balance.service';
import { GetBalanceDto } from './get-balance.dto';
import { routesConfig } from '../../../../config/routes.config';
import { Request } from 'express';

@ApiTags('Wallet')
@Controller()
export class GetBalanceController {
  constructor(private readonly getBalanceService: GetBalanceService) {}

  @Post(routesConfig.wallet.balance.path)
  @ApiOperation({ summary: "Consultation du solde du protefeuille" })
  async getBalance(@Req() req: Request, @Body() dto: GetBalanceDto) {
    const userId = (req as any).user?.authId || (req as any).user?.id || req.headers['x-user-id'];
    if (typeof userId === 'string') dto.authId = userId;
    return this.getBalanceService.execute(dto);
  }
}
