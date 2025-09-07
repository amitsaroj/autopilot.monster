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

  // Connect gRPC microservice
  const grpcUrl = configService.get<string>('GRPC_URL', 'localhost:3002');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'autopilot.auth',
      protoPath: join(__dirname, '../../../shared/proto/auth.proto'),
      url: grpcUrl,
      keepalive: {
        keepaliveTimeMs: 120000,
        keepaliveTimeoutMs: 5000,
        keepalivePermitWithoutCalls: true,
        http2MaxPingsWithoutData: 0,
        http2MinTimeBetweenPingsMs: 10000,
      },
    },
  });

  // Start all microservices
  await app.startAllMicroservices();
  
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
  logger.log(`🔗 gRPC Service is running on: ${grpcUrl}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start auth service:', error);
  process.exit(1);
});
