import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { RevokeTokenDto } from './revoke-token.dto';

@Injectable()
export class RevokeTokenService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: RevokeTokenDto) {
    const url = routesConfig.auth.token.revoke.link(this.services.auth);
    return this.httpProxy.post(url, dto, 'Revoke token failed');
  }
}
