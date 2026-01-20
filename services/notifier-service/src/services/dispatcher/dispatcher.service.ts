import { Injectable } from '@nestjs/common';
import { EmailService } from '../email.service';
import { SmsService } from '../sms.service';
import { PushService } from '../push.service';
import { EmailData } from '../../types/email-data.type';
import { SmsData } from '../../types/sms-data.type';
import { PushData } from '../../types/push-data.type';
import { NotificationType } from '../../interfaces/notification-service.interface';

@Injectable()
export class NotificationDispatcher {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly pushService: PushService,
  ) {}

  async dispatch(
    type: NotificationType,
    data: EmailData | SmsData | PushData,
  ): Promise<void> {
    switch (type) {
      case NotificationType.EMAIL:
        await this.emailService.send(data as EmailData);
        break;
      case NotificationType.SMS:
        await this.smsService.send(data as SmsData);
        break;
      case NotificationType.PUSH:
        await this.pushService.send(data as PushData);
        break;
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}
