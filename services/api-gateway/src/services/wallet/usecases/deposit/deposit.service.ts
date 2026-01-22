import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { DepositDto } from './deposit.dto';

@Injectable()
export class DepositService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: DepositDto) {
    const url = routesConfig.wallet.deposit.link(this.services.wallet);
    return this.httpProxy.post(url, dto, 'Deposit failed');
  }
}
