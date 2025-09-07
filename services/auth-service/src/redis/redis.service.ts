import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get<string>('database.redis.url'),
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis client error:', error);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.disconnect();
      this.logger.log('Redis client disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting from Redis:', error);
    }
  }

  // Session management
  async setRefreshToken(userId: string, token: string, ttl: number): Promise<void> {
    try {
      const key = `refresh_token:${userId}`;
      await this.client.setEx(key, ttl, token);
    } catch (error) {
      this.logger.error('Failed to set refresh token:', error);
      throw error;
    }
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    try {
      const key = `refresh_token:${userId}`;
      return await this.client.get(key);
    } catch (error) {
      this.logger.error('Failed to get refresh token:', error);
      throw error;
    }
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    try {
      const key = `refresh_token:${userId}`;
      await this.client.del(key);
    } catch (error) {
      this.logger.error('Failed to delete refresh token:', error);
      throw error;
    }
  }

  // Token blacklisting
  async blacklistToken(token: string, ttl: number): Promise<void> {
    try {
      const key = `blacklist:${token}`;
      await this.client.setEx(key, ttl, 'blacklisted');
    } catch (error) {
      this.logger.error('Failed to blacklist token:', error);
      throw error;
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const key = `blacklist:${token}`;
      const result = await this.client.get(key);
      return result === 'blacklisted';
    } catch (error) {
      this.logger.error('Failed to check token blacklist:', error);
      return false;
    }
  }

  // Rate limiting
  async incrementRateLimit(key: string, windowMs: number): Promise<number> {
    try {
      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, Math.ceil(windowMs / 1000));
      }
      return current;
    } catch (error) {
      this.logger.error('Failed to increment rate limit:', error);
      throw error;
    }
  }

  async getRateLimit(key: string): Promise<number> {
    try {
      const result = await this.client.get(key);
      return result ? parseInt(result, 10) : 0;
    } catch (error) {
      this.logger.error('Failed to get rate limit:', error);
      return 0;
    }
  }

  // General cache operations
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error('Failed to set cache value:', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Failed to get cache value:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error('Failed to delete cache value:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error('Failed to check if key exists:', error);
      return false;
    }
  }

  // Hash operations
  async hSet(key: string, field: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.hSet(key, field, serializedValue);
    } catch (error) {
      this.logger.error('Failed to set hash field:', error);
      throw error;
    }
  }

  async hGet<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.client.hGet(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Failed to get hash field:', error);
      return null;
    }
  }

  async hDel(key: string, field: string): Promise<void> {
    try {
      await this.client.hDel(key, field);
    } catch (error) {
      this.logger.error('Failed to delete hash field:', error);
      throw error;
    }
  }

  async hGetAll<T>(key: string): Promise<Record<string, T>> {
    try {
      const result = await this.client.hGetAll(key);
      const parsed: Record<string, T> = {};
      
      for (const [field, value] of Object.entries(result)) {
        try {
          parsed[field] = JSON.parse(value);
        } catch {
          parsed[field] = value as T;
        }
      }
      
      return parsed;
    } catch (error) {
      this.logger.error('Failed to get all hash fields:', error);
      return {};
    }
  }

  // List operations
  async lPush(key: string, ...values: any[]): Promise<number> {
    try {
      const serializedValues = values.map(v => JSON.stringify(v));
      return await this.client.lPush(key, serializedValues);
    } catch (error) {
      this.logger.error('Failed to push to list:', error);
      throw error;
    }
  }

  async lPop<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.lPop(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Failed to pop from list:', error);
      return null;
    }
  }

  async lRange<T>(key: string, start: number, stop: number): Promise<T[]> {
    try {
      const values = await this.client.lRange(key, start, stop);
      return values.map(v => JSON.parse(v));
    } catch (error) {
      this.logger.error('Failed to get list range:', error);
      return [];
    }
  }

  // Set operations
  async sAdd(key: string, ...members: any[]): Promise<number> {
    try {
      const serializedMembers = members.map(m => JSON.stringify(m));
      return await this.client.sAdd(key, serializedMembers);
    } catch (error) {
      this.logger.error('Failed to add to set:', error);
      throw error;
    }
  }

  async sIsMember(key: string, member: any): Promise<boolean> {
    try {
      const serializedMember = JSON.stringify(member);
      return await this.client.sIsMember(key, serializedMember);
    } catch (error) {
      this.logger.error('Failed to check set membership:', error);
      return false;
    }
  }

  async sMembers<T>(key: string): Promise<T[]> {
    try {
      const members = await this.client.sMembers(key);
      return members.map(m => JSON.parse(m));
    } catch (error) {
      this.logger.error('Failed to get set members:', error);
      return [];
    }
  }

  async sRem(key: string, ...members: any[]): Promise<number> {
    try {
      const serializedMembers = members.map(m => JSON.stringify(m));
      return await this.client.sRem(key, serializedMembers);
    } catch (error) {
      this.logger.error('Failed to remove from set:', error);
      throw error;
    }
  }
}
