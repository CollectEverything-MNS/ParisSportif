import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { ChangePasswordDto } from './change-password.dto';

@Injectable()
export class ChangePasswordService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: ChangePasswordDto) {
    const url = routesConfig.auth.changePassword.link(this.services.auth);
    return this.httpProxy.put(url, dto, 'Change password failed');
  }
}
