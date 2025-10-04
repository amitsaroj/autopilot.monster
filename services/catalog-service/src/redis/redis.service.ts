import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('redis.host', 'localhost'),
      port: this.configService.get('redis.port', 6379),
      password: this.configService.get('redis.password'),
      db: this.configService.get('redis.db', 0),
      maxRetriesPerRequest: 3,
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      this.logger.error(`Failed to get key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Failed to set key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check existence of key ${key}:`, error);
      return false;
    }
  }

  async lPush(key: string, value: string): Promise<void> {
    try {
      await this.redis.lpush(key, value);
    } catch (error) {
      this.logger.error(`Failed to lpush to key ${key}:`, error);
    }
  }

  async rPop(key: string): Promise<string | null> {
    try {
      return await this.redis.rpop(key);
    } catch (error) {
      this.logger.error(`Failed to rpop from key ${key}:`, error);
      return null;
    }
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.redis.lrange(key, start, stop);
    } catch (error) {
      this.logger.error(`Failed to lrange key ${key}:`, error);
      return [];
    }
  }

  async lLen(key: string): Promise<number> {
    try {
      return await this.redis.llen(key);
    } catch (error) {
      this.logger.error(`Failed to llen key ${key}:`, error);
      return 0;
    }
  }

  async hSet(key: string, field: string, value: string): Promise<void> {
    try {
      await this.redis.hset(key, field, value);
    } catch (error) {
      this.logger.error(`Failed to hset key ${key}:`, error);
    }
  }

  async hGet(key: string, field: string): Promise<string | null> {
    try {
      return await this.redis.hget(key, field);
    } catch (error) {
      this.logger.error(`Failed to hget key ${key}:`, error);
      return null;
    }
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    try {
      return await this.redis.hgetall(key);
    } catch (error) {
      this.logger.error(`Failed to hgetall key ${key}:`, error);
      return {};
    }
  }

  async hDel(key: string, field: string): Promise<void> {
    try {
      await this.redis.hdel(key, field);
    } catch (error) {
      this.logger.error(`Failed to hdel key ${key}:`, error);
    }
  }

  async sAdd(key: string, member: string): Promise<void> {
    try {
      await this.redis.sadd(key, member);
    } catch (error) {
      this.logger.error(`Failed to sadd key ${key}:`, error);
    }
  }

  async sMembers(key: string): Promise<string[]> {
    try {
      return await this.redis.smembers(key);
    } catch (error) {
      this.logger.error(`Failed to smembers key ${key}:`, error);
      return [];
    }
  }

  async sRem(key: string, member: string): Promise<void> {
    try {
      await this.redis.srem(key, member);
    } catch (error) {
      this.logger.error(`Failed to srem key ${key}:`, error);
    }
  }

  async zAdd(key: string, score: number, member: string): Promise<void> {
    try {
      await this.redis.zadd(key, score, member);
    } catch (error) {
      this.logger.error(`Failed to zadd key ${key}:`, error);
    }
  }

  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.redis.zrange(key, start, stop);
    } catch (error) {
      this.logger.error(`Failed to zrange key ${key}:`, error);
      return [];
    }
  }

  async zRevRange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.redis.zrevrange(key, start, stop);
    } catch (error) {
      this.logger.error(`Failed to zrevrange key ${key}:`, error);
      return [];
    }
  }

  async zScore(key: string, member: string): Promise<number | null> {
    try {
      const result = await this.redis.zscore(key, member);
      return result ? Number(result) : null;
    } catch (error) {
      this.logger.error(`Failed to zscore key ${key}:`, error);
      return null;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      this.logger.error(`Failed to incr key ${key}:`, error);
      return 0;
    }
  }

  async decr(key: string): Promise<number> {
    try {
      return await this.redis.decr(key);
    } catch (error) {
      this.logger.error(`Failed to decr key ${key}:`, error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.redis.expire(key, seconds);
    } catch (error) {
      this.logger.error(`Failed to expire key ${key}:`, error);
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to ttl key ${key}:`, error);
      return -1;
    }
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