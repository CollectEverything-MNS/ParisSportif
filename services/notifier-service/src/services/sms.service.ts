import { Injectable, Logger } from '@nestjs/common';
import { INotificationService } from '../interfaces/notification-service.interface';
import { SmsData } from '../types/sms-data.type';

@Injectable()
export class SmsService implements INotificationService {
  private readonly logger = new Logger(SmsService.name);

  async send(data: SmsData): Promise<void> {
    this.logger.log(`Pas encore fait`, { data });
  }
}
