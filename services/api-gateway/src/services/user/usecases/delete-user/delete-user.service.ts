import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';

@Injectable()
export class DeleteUserService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(id: string) {
    const url = routesConfig.user.deleteUser.link(this.services.user, id);
    return this.httpProxy.delete(url, 'Delete user failed');
  }
}
