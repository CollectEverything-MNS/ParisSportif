import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { ListTransactionsDto } from './list-transactions.dto';

@Injectable()
export class ListTransactionsService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: ListTransactionsDto) {
    const url = routesConfig.wallet.transactions.link(this.services.wallet);
    return this.httpProxy.post(url, dto, 'Transaction list failed');
  }
}
