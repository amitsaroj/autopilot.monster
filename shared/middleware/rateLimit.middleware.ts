/**
 * Rate Limiting Middleware
 * Protect APIs from abuse using Redis-based rate limiting
 */

import { Request, Response, NextFunction } from 'express';
import { redisManager } from '../config/redis';
import { logger } from '../config/logger';
import { envConfig } from '../config/env';

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  max?: number; // Maximum number of requests per window
  message?: string; // Custom error message
  keyGenerator?: (req: Request) => string; // Custom key generator
  skip?: (req: Request) => boolean; // Skip rate limiting for certain requests
  handler?: (req: Request, res: Response) => void; // Custom handler when limit exceeded
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs || envConfig.get('RATE_LIMIT_WINDOW_MS');
  const max = options.max || envConfig.get('RATE_LIMIT_MAX_REQUESTS');
  const message = options.message || 'Too many requests, please try again later';
  
  const defaultKeyGenerator = (req: Request): string => {
    return `rate-limit:${req.ip}`;
  };

  const keyGenerator = options.keyGenerator || defaultKeyGenerator;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip if skip function returns true
      if (options.skip && options.skip(req)) {
        return next();
      }

      const key = keyGenerator(req);
      const client = await redisManager.getClient();

      // Get current count
      const current = await client.get(key);
      const count = current ? parseInt(current) : 0;

      if (count >= max) {
        // Rate limit exceeded
        logger.warn(`Rate limit exceeded for ${key}`);

        if (options.handler) {
          return options.handler(req, res);
        }

        return res.status(429).json({
          success: false,
          error: 'Too Many Requests',
          message,
          statusCode: 429,
          timestamp: new Date().toISOString(),
          retryAfter: Math.ceil(windowMs / 1000),
        });
      }

      // Increment counter
      const newCount = count + 1;
      const ttl = count === 0 ? Math.ceil(windowMs / 1000) : await client.ttl(key);

      if (count === 0) {
        await client.setex(key, ttl, newCount.toString());
      } else {
        await client.set(key, newCount.toString());
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - newCount).toString());
      res.setHeader('X-RateLimit-Reset', (Date.now() + ttl * 1000).toString());

      next();
    } catch (error) {
      logger.error('Rate limit error:', error);
      // On error, allow the request to proceed
      next();
    }
  };
}

/**
 * Strict rate limit for sensitive endpoints
 */
export function strictRateLimit() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes
    message: 'Too many attempts, please try again after 15 minutes',
  });
}

/**
 * Auth rate limit for login/signup endpoints
 */
export function authRateLimit() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes
    message: 'Too many authentication attempts, please try again later',
    keyGenerator: (req: Request) => {
      return `auth-rate-limit:${req.ip}:${req.body.email || 'unknown'}`;
    },
  });
}

/**
 * API rate limit for general API endpoints
 */
export function apiRateLimit() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
  });
}

/**
 * User-based rate limit (requires authentication)
 */
export function userRateLimit(options: Omit<RateLimitOptions, 'keyGenerator'> = {}) {
  return rateLimit({
    ...options,
    keyGenerator: (req: any) => {
      const userId = req.user?.userId || req.ip;
      return `user-rate-limit:${userId}`;
    },
  });
}

