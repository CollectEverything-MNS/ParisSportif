import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../../../../shared/services/http-proxy.service';
import { serviceUrl, ServiceUrls } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UpdateUserService {
  private readonly services: ServiceUrls;

  constructor(
    private readonly httpProxy: HttpProxyService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(id: string, dto: UpdateUserDto) {
    const url = routesConfig.user.updateUser.link(this.services.user, id);
    return this.httpProxy.patch(url, dto, 'Update user failed');
  }
}
