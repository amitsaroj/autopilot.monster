/**
 * API Gateway
 * Routes requests to microservices and aggregates Swagger documentation
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import proxy from '@fastify/http-proxy';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import axios from 'axios';

const PORT = parseInt(process.env.API_GATEWAY_PORT || '4000', 10);
const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');

// Service URLs
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4002',
  user: process.env.USER_SERVICE_URL || 'http://localhost:4005',
  marketplace: process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:4003',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:4009',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:4004',
  vendor: process.env.VENDOR_SERVICE_URL || 'http://localhost:4006',
  content: process.env.CONTENT_SERVICE_URL || 'http://localhost:4008',
  admin: process.env.ADMIN_SERVICE_URL || 'http://localhost:4007',
};

const app = Fastify({
  logger: false,
  trustProxy: true,
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

async function start() {
  try {
    console.log('🚀 Starting API Gateway...');

    // CORS
    await app.register(cors, {
      origin: CORS_ORIGINS,
      credentials: true,
    });

    // Security
    await app.register(helmet, {
      contentSecurityPolicy: false,
    });

    // Rate limiting
    await app.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes',
    });

    // Swagger
    await app.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'Autopilot Monster API',
          description: 'Unified API Gateway for all microservices',
          version: '1.0.0',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
        components: {
          securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          },
        },
      },
    });

    await app.register(swaggerUi, {
      routePrefix: '/api-docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
    });

    // Proxy routes to services
    await app.register(proxy, {
      upstream: SERVICES.auth,
      prefix: '/api/auth',
      rewritePrefix: '/api/auth',
      http2: false,
    });

    await app.register(proxy, {
      upstream: SERVICES.user,
      prefix: '/api/users',
      rewritePrefix: '/api/users',
      http2: false,
    });

    await app.register(proxy, {
      upstream: SERVICES.marketplace,
      prefix: '/api/marketplace',
      rewritePrefix: '/api/marketplace',
      http2: false,
    });

    await app.register(proxy, {
      upstream: SERVICES.cart,
      prefix: '/api/cart',
      rewritePrefix: '/api/cart',
      http2: false,
    });

    await app.register(proxy, {
      upstream: SERVICES.order,
      prefix: '/api/orders',
      rewritePrefix: '/api/orders',
      http2: false,
    });

    await app.register(proxy, {
      upstream: SERVICES.vendor,
      prefix: '/api/vendors',
      rewritePrefix: '/api/vendors',
      http2: false,
    });

    await app.register(proxy, {
      upstream: SERVICES.content,
      prefix: '/api/content',
      rewritePrefix: '/api/content',
      http2: false,
    });

    await app.register(proxy, {
      upstream: SERVICES.admin,
      prefix: '/api/admin',
      rewritePrefix: '/api/admin',
      http2: false,
    });

    // Health check
    app.get('/health', async () => {
      const serviceHealth = await Promise.all(
        Object.entries(SERVICES).map(async ([name, url]) => {
          try {
            const response = await axios.get(`${url}/health`, { timeout: 3000 });
            return { service: name, status: 'healthy', url };
          } catch (error) {
            return { service: name, status: 'unhealthy', url };
          }
        })
      );

      const allHealthy = serviceHealth.every(s => s.status === 'healthy');

      return {
        status: allHealthy ? 'ok' : 'degraded',
        gateway: 'api-gateway',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: serviceHealth,
      };
    });

    // Unified Swagger endpoint
    app.get('/api-docs-json', async () => {
      try {
        console.log('📚 Aggregating Swagger specs from all services...');
        
        const specs = await Promise.allSettled(
          Object.entries(SERVICES).map(async ([name, url]) => {
            try {
              const response = await axios.get(`${url}/api-docs-json`, { timeout: 5000 });
              console.log(`  ✅ Fetched spec from ${name}`);
              return { name, spec: response.data };
            } catch (error) {
              console.log(`  ⚠️  Failed to fetch spec from ${name}`);
              return { name, spec: null };
            }
          })
        );

        // Merge all specs
        const mergedSpec = {
          openapi: '3.0.0',
          info: {
            title: 'Autopilot Monster - Unified API',
            version: '1.0.0',
            description: 'Complete API documentation for all microservices',
          },
          servers: [{ url: `http://localhost:${PORT}` }],
          components: {
            securitySchemes: {
              bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
            schemas: {},
          },
          paths: {},
          tags: [],
        };

        specs.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.spec) {
            const { name, spec } = result.value;
            
            // Merge paths with prefix
            if (spec.paths) {
              Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
                const prefixedPath = `/api/${name}${path}`;
                mergedSpec.paths[prefixedPath] = methods;
              });
            }

            // Merge schemas
            if (spec.components?.schemas) {
              mergedSpec.components.schemas = {
                ...mergedSpec.components.schemas,
                ...spec.components.schemas,
              };
            }

            // Merge tags
            if (spec.tags) {
              mergedSpec.tags = [...mergedSpec.tags, ...spec.tags];
            }
          }
        });

        return mergedSpec;
      } catch (error) {
        console.error('Error aggregating Swagger specs:', error);
        return app.swagger();
      }
    });

    // Error handler
    app.setErrorHandler((error, request, reply) => {
      console.error('Gateway error:', error);
      reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Internal Server Error',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
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

    // Start server
    await app.listen({ port: PORT, host: '0.0.0.0' });

    console.log('✅ API Gateway started successfully');
    console.log(`🌐 Gateway: http://localhost:${PORT}`);
    console.log(`📚 Unified API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('🔀 Service Routes:');
    Object.entries(SERVICES).forEach(([name, url]) => {
      console.log(`   /api/${name}/* → ${url}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received, shutting down gracefully...`);
      await app.close();
      console.log('👋 API Gateway stopped');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start API Gateway:', error);
    process.exit(1);
  }
}

start();

