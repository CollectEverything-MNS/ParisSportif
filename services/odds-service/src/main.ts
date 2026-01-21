import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.ODDS_SERVICE_PORT);

  if (!port) {
    throw new Error('ODDS_SERVICE_PORT is not defined');
  }

  await app.listen(port);

  const logger = new Logger('OddsService');
  logger.log(`Odds Service is running on http://localhost:${port}`);
}

bootstrap();
