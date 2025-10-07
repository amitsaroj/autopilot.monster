/**
 * Database Configuration and Connection Manager
 * Manages MongoDB connections for all microservices
 */

import mongoose from 'mongoose';
import { logger } from './logger';

export interface DbConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

class DatabaseManager {
  private connections: Map<string, mongoose.Connection> = new Map();

  /**
   * Connect to a database
   * @param serviceName - Name of the service
   * @param uri - MongoDB connection URI
   * @param options - Mongoose connection options
   */
  async connect(
    serviceName: string,
    uri: string,
    options?: mongoose.ConnectOptions
  ): Promise<mongoose.Connection> {
    try {
      // Check if connection already exists
      if (this.connections.has(serviceName)) {
        const existingConnection = this.connections.get(serviceName)!;
        if (existingConnection.readyState === 1) {
          logger.info(`[DB] Using existing connection for ${serviceName}`);
          return existingConnection;
        }
      }

      logger.info(`[DB] Connecting to database for ${serviceName}...`);

      const defaultOptions: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        ...options,
      };

      const connection = await mongoose.createConnection(uri, defaultOptions).asPromise();

      // Event listeners
      connection.on('connected', () => {
        logger.info(`[DB] ${serviceName} connected to MongoDB`);
      });

      connection.on('error', (error) => {
        logger.error(`[DB] ${serviceName} connection error:`, error);
      });

      connection.on('disconnected', () => {
        logger.warn(`[DB] ${serviceName} disconnected from MongoDB`);
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await this.disconnect(serviceName);
        process.exit(0);
      });

      this.connections.set(serviceName, connection);
      return connection;
    } catch (error) {
      logger.error(`[DB] Failed to connect to database for ${serviceName}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from a database
   * @param serviceName - Name of the service
   */
  async disconnect(serviceName: string): Promise<void> {
    try {
      const connection = this.connections.get(serviceName);
      if (connection) {
        await connection.close();
        this.connections.delete(serviceName);
        logger.info(`[DB] ${serviceName} disconnected from MongoDB`);
      }
    } catch (error) {
      logger.error(`[DB] Error disconnecting ${serviceName}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect all databases
   */
  async disconnectAll(): Promise<void> {
    const promises = Array.from(this.connections.keys()).map((serviceName) =>
      this.disconnect(serviceName)
    );
    await Promise.all(promises);
    logger.info('[DB] All database connections closed');
  }

  /**
   * Get connection for a service
   * @param serviceName - Name of the service
   */
  getConnection(serviceName: string): mongoose.Connection | undefined {
    return this.connections.get(serviceName);
  }

  /**
   * Check if service is connected
   * @param serviceName - Name of the service
   */
  isConnected(serviceName: string): boolean {
    const connection = this.connections.get(serviceName);
    return connection?.readyState === 1;
  }

  /**
   * Get connection health status
   * @param serviceName - Name of the service
   */
  getHealthStatus(serviceName: string): {
    connected: boolean;
    readyState: number;
    host?: string;
    name?: string;
  } {
    const connection = this.connections.get(serviceName);
    if (!connection) {
      return {
        connected: false,
        readyState: 0,
      };
    }

    return {
      connected: connection.readyState === 1,
      readyState: connection.readyState,
      host: connection.host,
      name: connection.name,
    };
  }
}

// Export singleton instance
export const dbManager = new DatabaseManager();

/**
 * Helper function to create a database connection for a service
 * @param serviceName - Name of the service
 * @param uri - MongoDB connection URI
 * @param options - Mongoose connection options
 */
export async function connectDatabase(
  serviceName: string,
  uri: string,
  options?: mongoose.ConnectOptions
): Promise<mongoose.Connection> {
  return dbManager.connect(serviceName, uri, options);
}

/**
 * Helper function to disconnect a service database
 * @param serviceName - Name of the service
 */
export async function disconnectDatabase(serviceName: string): Promise<void> {
  return dbManager.disconnect(serviceName);
}

/**
 * Helper function to get database connection
 * @param serviceName - Name of the service
 */
export function getDatabase(serviceName: string): mongoose.Connection | undefined {
  return dbManager.getConnection(serviceName);
}

/**
 * Helper function to check database health
 * @param serviceName - Name of the service
 */
export function getDatabaseHealth(serviceName: string) {
  return dbManager.getHealthStatus(serviceName);
}

// Re-export mongoose for convenience
export { mongoose };

