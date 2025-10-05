/**
 * Fastify App Configuration
 * Sets up Fastify with all plugins, middleware, and routes
 */

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
import authRoutes from './routes/auth.routes';

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // We use Winston for logging
    trustProxy: true,
    bodyLimit: 10 * 1024 * 1024, // 10MB
  });

  // CORS
  await app.register(cors, {
    origin: envConfig.get('CORS_ORIGINS'),
    credentials: true,
  });

  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Swagger/OpenAPI documentation
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Auth Service API',
        description: 'Authentication and user management service',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${envConfig.get('AUTH_SERVICE_PORT')}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        {
          name: 'Authentication',
          description: 'Authentication endpoints',
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // Request logging
  app.addHook('onRequest', async (request, reply) => {
    logger.http(`${request.method} ${request.url}`);
  });

  // Register routes
  await app.register(authRoutes, { prefix: '/api/auth' });

  // Health check endpoint
  app.get('/health', async (request, reply) => {
    try {
      const dbHealth = getDatabaseHealth('auth-service');
      const redisHealth = await redisManager.getHealthStatus();
      const kafkaHealth = kafkaManager.getHealthStatus();

      const health = {
        status: 'ok',
        service: 'auth-service',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        dependencies: {
          database: {
            status: dbHealth.connected ? 'connected' : 'disconnected',
            ...dbHealth,
          },
          redis: {
            status: redisHealth.connected ? 'connected' : 'disconnected',
            ...redisHealth,
          },
          kafka: {
            status: kafkaHealth.producerConnected ? 'connected' : 'disconnected',
            ...kafkaHealth,
          },
        },
      };

      const allHealthy = 
        dbHealth.connected && 
        redisHealth.connected && 
        kafkaHealth.producerConnected;

      return reply.status(allHealthy ? 200 : 503).send(health);
    } catch (error) {
      logger.error('Health check error:', error);
      return reply.status(503).send({
        status: 'error',
        service: 'auth-service',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      });
    }
  });

  // API docs JSON endpoint
  app.get('/api-docs-json', async () => {
    return app.swagger();
  });

  // Error handler
  app.setErrorHandler((error, request, reply) => {
    logger.error('Request error:', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
    });

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    reply.status(statusCode).send({
      success: false,
      error: message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  });

  // 404 handler
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

