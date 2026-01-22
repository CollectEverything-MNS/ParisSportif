import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { WithdrawDto } from './withdraw.dto';

@Injectable()
export class WithdrawService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: WithdrawDto) {
    const url = routesConfig.wallet.withdraw.link(this.services.wallet);
    return this.httpProxy.post(url, dto, 'Withdraw failed');
  }
}
