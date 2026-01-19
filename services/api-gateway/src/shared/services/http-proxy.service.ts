import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Injectable()
export class HttpProxyService {
  constructor(private readonly http: HttpService) {}

  async get<T>(url: string, errorMessage = 'Request failed'): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.http.get<T>(url));
      return data;
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async post<T>(url: string, body: unknown, errorMessage = 'Request failed'): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.http.post<T>(url, body));
      return data;
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async put<T>(url: string, body: unknown, errorMessage = 'Request failed'): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.http.put<T>(url, body));
      return data;
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async patch<T>(url: string, body: unknown, errorMessage = 'Request failed'): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.http.patch<T>(url, body));
      return data;
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async delete<T>(url: string, errorMessage = 'Request failed'): Promise<T> {
    try {
      const { data } = await firstValueFrom(this.http.delete<T>(url));
      return data;
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  private handleError(error: unknown, defaultMessage: string): never {
    if (error instanceof AxiosError && error.response) {
      const data = error.response.data as ErrorResponse | string;
      let message = defaultMessage;

      if (typeof data === 'string') {
        message = data;
      } else if (this.isErrorResponse(data)) {
        const errorMessage = data.message;
        if (errorMessage) {
          message = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
        }
      }

      throw new HttpException(message, error.response.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
  }

  private isErrorResponse(data: unknown): data is ErrorResponse {
    return typeof data === 'object' && data !== null && 'message' in data;
  }
}
