import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
        queue: 'notifications_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();

  const logger = new Logger('NotifierService');
  logger.log('Notifier Service is listening for RabbitMQ events');
}

bootstrap();
