export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}
export interface INotificationService {
  send(data: any): Promise<void>;
}
