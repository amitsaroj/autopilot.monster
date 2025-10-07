import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { logger } from '../../../shared/config/logger';
import { envConfig } from '../../../shared/config/env';
import { getDatabaseHealth } from '../../../shared/config/db';
import { redisManager } from '../../../shared/config/redis';
import { kafkaManager } from '../../../shared/config/kafka';

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false, trustProxy: true });

  await app.register(cors, {
    origin: envConfig.get('CORS_ORIGINS'),
    credentials: true,
  });

  await app.register(helmet, { contentSecurityPolicy: false });

  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Vendor Service API',
        description: 'Vendor management and analytics',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:4006` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: { docExpansion: 'list', deepLinking: false },
  });

  app.get('/health', async () => {
    const dbHealth = getDatabaseHealth('vendor-service');
    const redisHealth = await redisManager.getHealthStatus();
    const kafkaHealth = kafkaManager.getHealthStatus();

    return {
      status: 'ok',
      service: 'vendor-service',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dependencies: {
        database: { status: dbHealth.connected ? 'connected' : 'disconnected', ...dbHealth },
        redis: { status: redisHealth.connected ? 'connected' : 'disconnected', ...redisHealth },
        kafka: { status: kafkaHealth.producerConnected ? 'connected' : 'disconnected', ...kafkaHealth },
      },
    };
  });

  app.get('/api-docs-json', async () => app.swagger());

  // Register routes
  const vendorRoutes = (await import('./routes/vendor.routes')).default;
  await app.register(vendorRoutes, { prefix: '/api/vendor' });

  app.setErrorHandler((error, request, reply) => {
    logger.error('Request error:', { error: error.message, url: request.url });
    reply.status(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: 'Not Found',
      message: `Route ${request.url} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
