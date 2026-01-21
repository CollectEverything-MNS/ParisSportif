import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const url = process.env.RABBITMQ_URL;
  if (!url) {
    throw new Error('RABBITMQ_URL is not defined');
  }

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: { urls: [url], queue: 'user_events', queueOptions: { durable: true } },
  });
  await app.startAllMicroservices();

  const port = Number(process.env.AUTH_SERVICE_PORT);
  if (!port) {
    throw new Error('AUTH_SERVICE_PORT is not defined');
  }

  await app.listen(port);

  const logger = new Logger('AuthService');
  logger.log(`Auth Service is running on http://localhost:${port}`);
}

bootstrap();
