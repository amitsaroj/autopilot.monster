import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Create the main application
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3007);
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
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:3005',
        'http://localhost:3006',
        'http://localhost:3007',
        'http://localhost:3008',
      ],
      credentials: true,
    });

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Admin Service API')
      .setDescription('Admin management API for Autopilot.Monster')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('admin', 'Admin management endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('vendors', 'Vendor management endpoints')
      .addTag('products', 'Product management endpoints')
      .addTag('orders', 'Order management endpoints')
      .addTag('analytics', 'Analytics endpoints')
      .addTag('settings', 'System settings endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

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

    logger.log(`🔧 Admin Service is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
    logger.log(`🌍 Environment: ${nodeEnv}`);
  } catch (error) {
    logger.error('Failed to start admin service:', error);
    process.exit(1);
  }
}

bootstrap();
