import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { serviceUrl } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';
import { LoginDto } from './login.dto';

@Injectable()
export class LoginService {
  private readonly services;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute(dto: LoginDto) {
    const url = routesConfig.auth.login.link(this.services.auth);

    try {
      const { data } = await firstValueFrom(this.http.post(url, dto));
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(
          error.response.data?.message || 'Login failed',
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Auth service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
