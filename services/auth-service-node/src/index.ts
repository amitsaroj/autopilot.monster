/**
 * Auth Service Entry Point
 * Initializes and starts the authentication microservice
 */

import { createApp } from './app';
import { envConfig } from '../../../shared/config/env';
import { connectDatabase } from '../../../shared/config/db';
import { logger, createServiceLogger } from '../../../shared/config/logger';
import { redisManager } from '../../../shared/config/redis';
import { kafkaManager } from '../../../shared/config/kafka';

const SERVICE_NAME = 'auth-service';
const PORT = envConfig.get('AUTH_SERVICE_PORT');
const serviceLogger = createServiceLogger(SERVICE_NAME);

async function startServer() {
  try {
    serviceLogger.info('🚀 Starting Auth Service...');

    // Connect to MongoDB
    serviceLogger.info('Connecting to MongoDB...');
    await connectDatabase(SERVICE_NAME, envConfig.get('AUTH_DB_URL'));
    serviceLogger.info('✅ MongoDB connected');

    // Connect to Redis
    serviceLogger.info('Connecting to Redis...');
    await redisManager.getClient();
    serviceLogger.info('✅ Redis connected');

    // Initialize Kafka (producer only for auth service)
    serviceLogger.info('Initializing Kafka...');
    // Kafka will connect lazily when first message is sent
    serviceLogger.info('✅ Kafka initialized');

    // Create and start Fastify app
    serviceLogger.info('Creating Fastify application...');
    const app = await createApp();

    await app.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });

    serviceLogger.info(`✅ Auth Service started successfully`);
    serviceLogger.info(`🌐 Server: http://localhost:${PORT}`);
    serviceLogger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    serviceLogger.info(`❤️  Health: http://localhost:${PORT}/health`);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      serviceLogger.info(`${signal} received, starting graceful shutdown...`);

      try {
        // Close Fastify server
        await app.close();
        serviceLogger.info('✅ Fastify server closed');

        // Close database connections
        const { disconnectDatabase } = await import('../../../shared/config/db');
        await disconnectDatabase(SERVICE_NAME);
        serviceLogger.info('✅ Database connection closed');

        // Close Redis connection
        await redisManager.disconnect();
        serviceLogger.info('✅ Redis connection closed');

        // Close Kafka connections
        await kafkaManager.disconnectAll();
        serviceLogger.info('✅ Kafka connections closed');

        serviceLogger.info('👋 Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        serviceLogger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      serviceLogger.error('Uncaught exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      serviceLogger.error('Unhandled rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

  } catch (error) {
    serviceLogger.error('Failed to start Auth Service:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

