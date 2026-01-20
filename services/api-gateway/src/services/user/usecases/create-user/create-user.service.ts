import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class CreateUserService {
  private readonly services: ServiceUrls;

  constructor(private readonly httpProxy: HttpProxyService, private readonly config: ConfigService) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: CreateUserDto) {
    const url = routesConfig.user.createUser.link(this.services.user);
    return this.httpProxy.post(url, dto, 'Create user failed');
  }
}