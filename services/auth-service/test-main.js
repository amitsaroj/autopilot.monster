const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, Logger } = require('@nestjs/common');

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Create a minimal app without database dependencies
    const app = await NestFactory.create({
      module: class TestModule {},
      providers: [],
      controllers: [],
    }, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const port = process.env.PORT || 3002;
    const nodeEnv = process.env.NODE_ENV || 'development';

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

    // Start HTTP server
    await app.listen(port);

    logger.log(`🔐 Test Auth Service is running on: http://localhost:${port}`);
    logger.log(`🌍 Environment: ${nodeEnv}`);
  } catch (error) {
    logger.error('Failed to start test service:', error);
    process.exit(1);
  }
}

bootstrap();
