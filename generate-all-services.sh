#!/bin/bash

# ========================================================
# Autopilot Monster - Service Generation Script
# Generates all microservices based on Auth Service template
# ========================================================

set -e

echo "🚀 Generating All Microservices..."
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Base directory
BASE_DIR="/Users/amitsaroj/Desktop/autopilot.monster"
SERVICES_DIR="$BASE_DIR/services"
TEMPLATE_DIR="$SERVICES_DIR/auth-service-node"

# Service definitions: name|port|db_name|description
SERVICES=(
    "user-service-node|4005|user_db|User profile and preferences management"
    "marketplace-service-node|4003|marketplace_db|Product catalog and marketplace"
    "cart-service-node|4009|cart_db|Shopping cart management"
    "order-service-node|4004|order_db|Order processing and payments"
    "vendor-service-node|4006|vendor_db|Vendor management and analytics"
    "content-service-node|4008|content_db|Blog and content management"
    "admin-service-node|4007|admin_db|Admin panel and system management"
)

# Function to create service from template
create_service() {
    local service_name=$1
    local port=$2
    local db_name=$3
    local description=$4
    
    local service_dir="$SERVICES_DIR/$service_name"
    local service_upper=$(echo $service_name | sed 's/-node//' | sed 's/-/_/g' | tr '[:lower:]' '[:upper:]')
    local service_title=$(echo $service_name | sed 's/-node//' | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
    
    print_status "Creating $service_title..."
    
    # Create directory structure
    mkdir -p "$service_dir/src"/{controllers,services,models,routes}
    
    # Create package.json
    cat > "$service_dir/package.json" << EOF
{
  "name": "@autopilot-monster/$service_name",
  "version": "1.0.0",
  "description": "$description",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "fastify": "^4.26.0",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/swagger": "^8.14.0",
    "@fastify/swagger-ui": "^3.0.0",
    "mongoose": "^8.1.1",
    "ioredis": "^5.3.2",
    "kafkajs": "^2.2.4",
    "winston": "^3.11.0",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/node": "^20.11.17",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0"
  }
}
EOF
    
    # Create tsconfig.json
    cp "$TEMPLATE_DIR/tsconfig.json" "$service_dir/tsconfig.json"
    
    # Create Dockerfile
    sed "s/4002/$port/g" "$TEMPLATE_DIR/Dockerfile" > "$service_dir/Dockerfile"
    
    # Create .dockerignore
    cat > "$service_dir/.dockerignore" << EOF
node_modules
dist
*.log
.env
.git
EOF
    
    # Create index.ts
    cat > "$service_dir/src/index.ts" << EOF
import { createApp } from './app';
import { envConfig } from '../../../shared/config/env';
import { connectDatabase } from '../../../shared/config/db';
import { logger, createServiceLogger } from '../../../shared/config/logger';
import { redisManager } from '../../../shared/config/redis';
import { kafkaManager } from '../../../shared/config/kafka';

const SERVICE_NAME = '$(echo $service_name | sed 's/-node//')';
const PORT = envConfig.get('${service_upper}_PORT');
const serviceLogger = createServiceLogger(SERVICE_NAME);

async function startServer() {
  try {
    serviceLogger.info(\`🚀 Starting \${SERVICE_NAME}...\`);

    await connectDatabase(SERVICE_NAME, envConfig.get('${service_upper}_DB_URL'));
    serviceLogger.info('✅ MongoDB connected');

    await redisManager.getClient();
    serviceLogger.info('✅ Redis connected');

    serviceLogger.info('✅ Kafka initialized');

    const app = await createApp();
    await app.listen({ port: PORT, host: '0.0.0.0' });

    serviceLogger.info(\`✅ \${SERVICE_NAME} started successfully\`);
    serviceLogger.info(\`🌐 Server: http://localhost:\${PORT}\`);
    serviceLogger.info(\`📚 API Docs: http://localhost:\${PORT}/api-docs\`);

    const gracefulShutdown = async (signal: string) => {
      serviceLogger.info(\`\${signal} received, starting graceful shutdown...\`);
      try {
        await app.close();
        const { disconnectDatabase } = await import('../../../shared/config/db');
        await disconnectDatabase(SERVICE_NAME);
        await redisManager.disconnect();
        await kafkaManager.disconnectAll();
        serviceLogger.info('👋 Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        serviceLogger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    serviceLogger.error(\`Failed to start \${SERVICE_NAME}:\`, error);
    process.exit(1);
  }
}

startServer();
EOF
    
    # Create app.ts
    cat > "$service_dir/src/app.ts" << EOF
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
        title: '$service_title API',
        description: '$description',
        version: '1.0.0',
      },
      servers: [{ url: \`http://localhost:${port}\` }],
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
    const dbHealth = getDatabaseHealth('$(echo $service_name | sed 's/-node//')');
    const redisHealth = await redisManager.getHealthStatus();
    const kafkaHealth = kafkaManager.getHealthStatus();

    return {
      status: 'ok',
      service: '$(echo $service_name | sed 's/-node//')',
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
      message: \`Route \${request.url} not found\`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
EOF
    
    print_success "$service_title created at $service_dir"
}

# Generate all services
for service_def in "${SERVICES[@]}"; do
    IFS='|' read -r name port db desc <<< "$service_def"
    create_service "$name" "$port" "$db" "$desc"
done

echo ""
print_success "All services generated successfully!"
echo ""
echo "📊 Services Created:"
echo "  ✅ User Service (port 4005)"
echo "  ✅ Marketplace Service (port 4003)"
echo "  ✅ Cart Service (port 4009)"
echo "  ✅ Order Service (port 4004)"
echo "  ✅ Vendor Service (port 4006)"
echo "  ✅ Content Service (port 4008)"
echo "  ✅ Admin Service (port 4007)"
echo ""
echo "🔄 Next steps:"
echo "  1. Install dependencies: cd services/<service-name> && npm install"
echo "  2. Or run: ./install-all-services.sh"
echo ""

