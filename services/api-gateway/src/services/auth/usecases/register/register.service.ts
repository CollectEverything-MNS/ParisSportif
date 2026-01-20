import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { RegisterDto } from './register.dto';

@Injectable()
export class RegisterService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: RegisterDto) {
    const url = routesConfig.auth.register.link(this.services.auth);
    return this.httpProxy.post(url, dto, 'Registration failed');
  }
}
