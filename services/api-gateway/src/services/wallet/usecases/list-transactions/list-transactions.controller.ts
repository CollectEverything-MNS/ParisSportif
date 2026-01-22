import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListTransactionsService } from './list-transactions.service';
import { ListTransactionsDto } from './list-transactions.dto';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Wallet')
@Controller()
export class ListTransactionsController {
  constructor(private readonly listTransactionsService: ListTransactionsService) {}

  @Post(routesConfig.wallet.transactions.path)
  @ApiOperation({ summary: "Lister les différentes transactions effectuées sur le portefeuille" })
  async listTransactions(@Body() dto: ListTransactionsDto) {
    return this.listTransactionsService.execute(dto);
  }
}
