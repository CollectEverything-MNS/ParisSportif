import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.CALENDAR_SERVICE_PORT);

  if (!port) {
    throw new Error('CALENDAR_SERVICE_PORT is not defined');
  }

  await app.listen(port);

  const logger = new Logger('CalendarService');
  logger.log(`Calendar Service is running on http://localhost:${port}`);
}

bootstrap();
