import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { RefreshTokenDto } from './refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: RefreshTokenDto) {
    const url = routesConfig.auth.token.refresh.link(this.services.auth);
    return this.httpProxy.post(url, dto, 'Refresh token failed');
  }
}
