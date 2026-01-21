import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';

@Injectable()
export class GetUserService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(id: string) {
    const url = routesConfig.user.getUser.link(this.services.user, id);
    return this.httpProxy.get(url, 'Get user by id failed');
  }
}
