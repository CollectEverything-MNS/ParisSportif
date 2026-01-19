import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { serviceUrl } from '../../../../config/services.config';
import { routesConfig } from '../../../../config/routes.config';

@Injectable()
export class ListMatchsService {
  private readonly services;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) {
    this.services = serviceUrl(this.config);
  }

  async execute() {
    const url = routesConfig.match.root.link(this.services.match);

    try {
      const { data } = await firstValueFrom(this.http.get(url));
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(
          error.response.data?.message || 'An error occurred',
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Match service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
