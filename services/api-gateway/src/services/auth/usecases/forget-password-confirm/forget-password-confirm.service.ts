import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { ForgetPasswordConfirmDto } from './forget-password-confirm.dto';

@Injectable()
export class ForgetPasswordConfirmService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: ForgetPasswordConfirmDto) {
    const url = routesConfig.auth.forgetPasswordConfirm.link(this.services.auth);
    return this.httpProxy.post(url, dto, 'Forget password confirm failed');
  }
}
