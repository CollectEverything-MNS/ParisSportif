import { Injectable, Logger } from '@nestjs/common';
import { INotificationService } from '../interfaces/notification-service.interface';
import { PushData } from '../types/push-data.type';

@Injectable()
export class PushService implements INotificationService {
  private readonly logger = new Logger(PushService.name);

  async send(data: PushData): Promise<void> {
    this.logger.log(`Pas encore fait`, { data });
  }
}
