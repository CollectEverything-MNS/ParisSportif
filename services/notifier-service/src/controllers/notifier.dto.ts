import { NotificationType } from '../interfaces/notification-service.interface';

export class NotificationPayload {
  type: NotificationType;
  data: any;
}
