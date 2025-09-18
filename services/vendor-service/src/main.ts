import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create the main application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3008);
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

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger documentation
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Vendor Service API')
      .setDescription('Vendor management service for Autopilot.Monster')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('vendors', 'Vendor management endpoints')
      .addTag('kyc', 'KYC verification endpoints')
      .addTag('analytics', 'Vendor analytics endpoints')
      .addTag('payouts', 'Payout management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  // Connect gRPC microservice
  const grpcUrl = configService.get<string>('GRPC_URL', 'localhost:3008');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'autopilot.vendor',
      protoPath: join(__dirname, '../../../shared/proto/vendor.proto'),
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
  
  // Start HTTP server
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

  logger.log(`🏪 Vendor Service is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  logger.log(`🔧 Environment: ${nodeEnv}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Vendor Service:', error);
  process.exit(1);
});
