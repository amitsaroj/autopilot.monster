import { createApp } from './app';
import { envConfig } from '../../../shared/config/env';
import { connectDatabase } from '../../../shared/config/db';
import { logger, createServiceLogger } from '../../../shared/config/logger';
import { redisManager } from '../../../shared/config/redis';
import { kafkaManager } from '../../../shared/config/kafka';

const SERVICE_NAME = 'admin-service';
const PORT = envConfig.get('ADMIN_SERVICE_PORT');
const serviceLogger = createServiceLogger(SERVICE_NAME);

async function startServer() {
  try {
    serviceLogger.info(`🚀 Starting ${SERVICE_NAME}...`);

    await connectDatabase(SERVICE_NAME, envConfig.get('ADMIN_SERVICE_DB_URL'));
    serviceLogger.info('✅ MongoDB connected');

    await redisManager.getClient();
    serviceLogger.info('✅ Redis connected');

    serviceLogger.info('✅ Kafka initialized');

    const app = await createApp();
    await app.listen({ port: PORT, host: '0.0.0.0' });

    serviceLogger.info(`✅ ${SERVICE_NAME} started successfully`);
    serviceLogger.info(`🌐 Server: http://localhost:${PORT}`);
    serviceLogger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);

    const gracefulShutdown = async (signal: string) => {
      serviceLogger.info(`${signal} received, starting graceful shutdown...`);
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
    serviceLogger.error(`Failed to start ${SERVICE_NAME}:`, error);
    process.exit(1);
  }
}

startServer();
