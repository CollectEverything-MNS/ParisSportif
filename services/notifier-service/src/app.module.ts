import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotifierController } from './controllers/notifier.controller';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { PushService } from './services/push.service';
import { NotificationDispatcher } from './services/dispatcher/dispatcher.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotifierController],
  providers: [EmailService, SmsService, PushService, NotificationDispatcher],
})
export class AppModule {}
