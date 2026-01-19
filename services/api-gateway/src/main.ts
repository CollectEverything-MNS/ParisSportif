import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const port = configService.get<number>('API_GATEWAY_PORT', 3001);

  if (nodeEnv === 'development') {
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

    const config = new DocumentBuilder()
      .setTitle(`Projet Paris sportif - ${nodeEnv}`)
      .setDescription('API Gateway pour le projet Paris sportif')
      .setVersion('1.0')
      .addTag('User', 'Gestion des utilisateurs')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  } else {
    app.useLogger(['error', 'warn']);
  }

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log('=================================================');
  logger.log(`API Gateway running in ${nodeEnv.toUpperCase()} mode`);
  logger.log(`HTTP: http://localhost:${port}`);
  logger.log('=================================================');
}

bootstrap();
