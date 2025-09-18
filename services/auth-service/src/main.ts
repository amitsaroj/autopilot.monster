import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create the main application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3002);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: nodeEnv === 'production',
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // gRPC microservice disabled for now
  // TODO: Enable gRPC when proto files are available
  
  // Start HTTP server for health checks
  await app.listen(port);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.log('SIGTERM received, shutting down gracefully');
    app.close();
  });

  process.on('SIGINT', () => {
    logger.log('SIGINT received, shutting down gracefully');
    app.close();
  });

  logger.log(`🔐 Auth Service is running on: http://localhost:${port}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start auth service:', error);
  process.exit(1);
});
