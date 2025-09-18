import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    try {
      this.redis = new Redis({
        host: this.configService.get('redis.host', 'localhost'),
        port: this.configService.get('redis.port', 6379),
        password: this.configService.get('redis.password'),
        db: this.configService.get('redis.db', 0),
        maxRetriesPerRequest: 3,
        lazyConnect: true, // Don't connect immediately
      });

      this.redis.on('error', (error) => {
        this.logger.warn('Redis connection error (service will continue without Redis):', error.message);
      });

      this.redis.on('connect', () => {
        this.logger.log('Connected to Redis');
      });
    } catch (error) {
      this.logger.warn('Failed to initialize Redis (service will continue without Redis):', error.message);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.redis) return null;
      return await this.redis.get(key);
    } catch (error) {
      this.logger.warn(`Failed to get key ${key} (Redis not available):`, error.message);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (!this.redis) return;
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      this.logger.warn(`Failed to set key ${key} (Redis not available):`, error.message);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (!this.redis) return;
      await this.redis.del(key);
    } catch (error) {
      this.logger.warn(`Failed to delete key ${key} (Redis not available):`, error.message);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.redis) return false;
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.warn(`Failed to check existence of key ${key} (Redis not available):`, error.message);
      return false;
    }
  }

  async setRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.set(key, refreshToken, ttl);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    return await this.get(key);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.del(key);
  }

  async blacklistToken(token: string, ttl: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.set(key, '1', ttl);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    return await this.exists(key);
  }

  async setUserSession(userId: string, sessionData: any, ttl: number): Promise<void> {
    const key = `session:${userId}`;
    await this.set(key, JSON.stringify(sessionData), ttl);
  }

  async getUserSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteUserSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await this.del(key);
  }

  async incrementLoginAttempts(ip: string): Promise<number> {
    const key = `login_attempts:${ip}`;
    const attempts = await this.redis.incr(key);
    if (attempts === 1) {
      await this.redis.expire(key, 900); // 15 minutes
    }
    return attempts;
  }

  async resetLoginAttempts(ip: string): Promise<void> {
    const key = `login_attempts:${ip}`;
    await this.del(key);
  }

  async getLoginAttempts(ip: string): Promise<number> {
    const key = `login_attempts:${ip}`;
    const attempts = await this.get(key);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  async setCache(key: string, data: any, ttl: number = 3600): Promise<void> {
    await this.set(key, JSON.stringify(data), ttl);
  }

  async getCache(key: string): Promise<any | null> {
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteCache(key: string): Promise<void> {
    await this.del(key);
  }

  async flushAll(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      this.logger.error('Failed to flush Redis:', error);
    }
  }

  async disconnect(): Promise<void> {
    await this.redis.disconnect();
  }
}