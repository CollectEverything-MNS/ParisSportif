import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { INotificationService } from '../interfaces/notification-service.interface';
import { EmailData } from '../types/email-data.type';

@Injectable()
export class EmailService implements INotificationService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      secure: this.config.get('SMTP_SECURE') || false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  async send(email: EmailData): Promise<void> {
    try {
      const recipients = Array.isArray(email.to)
        ? email.to.join(', ')
        : email.to;

      this.logger.log(`JE SUIS DANS LE SERVICE NOTIFIER, RABBIT MQ FONCTIONNE`);

      const info = await this.transporter.sendMail({
        from: email.from || this.config.get('SMTP_FROM'),
        to: recipients,
        subject: email.subject,
        text: email.body,
        html: email.html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed: ${error.message}`);
      throw error;
    }
  }
}
