/**
 * Redis Configuration and Manager
 * Centralized Redis connection management with connection pooling
 */

import Redis from 'ioredis';
import { logger } from './logger';
import { envConfig } from './env';

class RedisManager {
  private client: Redis | null = null;
  private isConnected: boolean = false;

  /**
   * Get or create Redis client
   */
  async getClient(): Promise<Redis> {
    if (this.client && this.isConnected) {
      return this.client;
    }

    try {
      const redisConfig = {
        host: envConfig.get('REDIS_HOST'),
        port: envConfig.get('REDIS_PORT'),
        password: envConfig.get('REDIS_PASSWORD'),
        db: envConfig.get('REDIS_DB'),
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err: Error) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      };

      this.client = new Redis(redisConfig);

      this.client.on('connect', () => {
        logger.info('[Redis] Connecting to Redis...');
      });

      this.client.on('ready', () => {
        logger.info('[Redis] Redis client ready');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        logger.error('[Redis] Redis client error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        logger.warn('[Redis] Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        logger.info('[Redis] Reconnecting to Redis...');
      });

      return this.client;
    } catch (error) {
      logger.error('[Redis] Failed to initialize Redis client:', error);
      throw error;
    }
  }

  /**
   * Disconnect Redis client
   */
  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
        this.isConnected = false;
        logger.info('[Redis] Redis client disconnected');
      }
    } catch (error) {
      logger.error('[Redis] Error disconnecting Redis client:', error);
      throw error;
    }
  }

  /**
   * Check if Redis is connected
   */
  isClientConnected(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Get health status
   */
  async getHealthStatus(): Promise<{
    connected: boolean;
    ping?: string;
    error?: string;
  }> {
    try {
      if (!this.client || !this.isConnected) {
        return {
          connected: false,
          error: 'Redis client not initialized or not connected',
        };
      }

      const pingResult = await this.client.ping();
      return {
        connected: true,
        ping: pingResult,
      };
    } catch (error: any) {
      return {
        connected: false,
        error: error.message,
      };
    }
  }

  /**
   * Set a value with optional TTL
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const client = await this.getClient();
      const serialized = JSON.stringify(value);
      
      if (ttl) {
        await client.setex(key, ttl, serialized);
      } else {
        await client.set(key, serialized);
      }
      
      logger.debug(`[Redis] Set key: ${key}`);
    } catch (error) {
      logger.error(`[Redis] Error setting key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a value
   * @param key - Cache key
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const client = await this.getClient();
      const value = await client.get(key);
      
      if (!value) {
        return null;
      }
      
      logger.debug(`[Redis] Get key: ${key}`);
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`[Redis] Error getting key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete a key
   * @param key - Cache key
   */
  async del(key: string): Promise<void> {
    try {
      const client = await this.getClient();
      await client.del(key);
      logger.debug(`[Redis] Deleted key: ${key}`);
    } catch (error) {
      logger.error(`[Redis] Error deleting key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete keys by pattern
   * @param pattern - Key pattern (e.g., 'user:*')
   */
  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const client = await this.getClient();
      const keys = await client.keys(pattern);
      
      if (keys.length === 0) {
        return 0;
      }
      
      await client.del(...keys);
      logger.debug(`[Redis] Deleted ${keys.length} keys matching pattern: ${pattern}`);
      return keys.length;
    } catch (error) {
      logger.error(`[Redis] Error deleting keys by pattern ${pattern}:`, error);
      throw error;
    }
  }

  /**
   * Check if key exists
   * @param key - Cache key
   */
  async exists(key: string): Promise<boolean> {
    try {
      const client = await this.getClient();
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`[Redis] Error checking existence of key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set expiration on key
   * @param key - Cache key
   * @param ttl - Time to live in seconds
   */
  async expire(key: string, ttl: number): Promise<void> {
    try {
      const client = await this.getClient();
      await client.expire(key, ttl);
      logger.debug(`[Redis] Set expiration on key ${key}: ${ttl}s`);
    } catch (error) {
      logger.error(`[Redis] Error setting expiration on key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Increment a value
   * @param key - Cache key
   * @param increment - Increment value (default: 1)
   */
  async incr(key: string, increment: number = 1): Promise<number> {
    try {
      const client = await this.getClient();
      const result = await client.incrby(key, increment);
      logger.debug(`[Redis] Incremented key ${key} by ${increment}`);
      return result;
    } catch (error) {
      logger.error(`[Redis] Error incrementing key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Add item to set
   * @param key - Set key
   * @param members - Members to add
   */
  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      const client = await this.getClient();
      const result = await client.sadd(key, ...members);
      logger.debug(`[Redis] Added ${members.length} members to set ${key}`);
      return result;
    } catch (error) {
      logger.error(`[Redis] Error adding to set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all members of a set
   * @param key - Set key
   */
  async smembers(key: string): Promise<string[]> {
    try {
      const client = await this.getClient();
      const members = await client.smembers(key);
      return members;
    } catch (error) {
      logger.error(`[Redis] Error getting set members ${key}:`, error);
      throw error;
    }
  }

  /**
   * Add item to sorted set
   * @param key - Sorted set key
   * @param score - Score
   * @param member - Member
   */
  async zadd(key: string, score: number, member: string): Promise<number> {
    try {
      const client = await this.getClient();
      const result = await client.zadd(key, score, member);
      logger.debug(`[Redis] Added to sorted set ${key}`);
      return result;
    } catch (error) {
      logger.error(`[Redis] Error adding to sorted set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get range from sorted set
   * @param key - Sorted set key
   * @param start - Start index
   * @param stop - Stop index
   */
  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      const client = await this.getClient();
      const result = await client.zrange(key, start, stop);
      return result;
    } catch (error) {
      logger.error(`[Redis] Error getting sorted set range ${key}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const redisManager = new RedisManager();

/**
 * Helper function to get Redis client
 */
export async function getRedisClient(): Promise<Redis> {
  return redisManager.getClient();
}

/**
 * Cache helper functions
 */
export const cache = {
  set: (key: string, value: any, ttl?: number) => redisManager.set(key, value, ttl),
  get: <T = any>(key: string) => redisManager.get<T>(key),
  del: (key: string) => redisManager.del(key),
  deleteByPattern: (pattern: string) => redisManager.deleteByPattern(pattern),
  exists: (key: string) => redisManager.exists(key),
  expire: (key: string, ttl: number) => redisManager.expire(key, ttl),
  incr: (key: string, increment?: number) => redisManager.incr(key, increment),
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await redisManager.disconnect();
});

process.on('SIGTERM', async () => {
  await redisManager.disconnect();
});

export default redisManager;

