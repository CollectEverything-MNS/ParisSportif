import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationDispatcher } from '../services/dispatcher/dispatcher.service';
import { NotificationPayload } from './notifier.dto';

@Controller()
export class NotifierController {
  private readonly logger = new Logger(NotifierController.name);

  constructor(private readonly dispatcher: NotificationDispatcher) {}

  @EventPattern('send_notification')
  async handleNotification(@Payload() payload: NotificationPayload) {
    this.logger.log(`Received ${payload.type} notification event`);
    await this.dispatcher.dispatch(payload.type, payload.data);
  }
}
