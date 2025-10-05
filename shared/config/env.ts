/**
 * Environment Configuration
 * Centralized environment variable management for all microservices
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface EnvConfig {
  // Node Environment
  NODE_ENV: string;
  
  // Service Ports
  API_GATEWAY_PORT: number;
  AUTH_SERVICE_PORT: number;
  USER_SERVICE_PORT: number;
  MARKETPLACE_SERVICE_PORT: number;
  CART_SERVICE_PORT: number;
  ORDER_SERVICE_PORT: number;
  VENDOR_SERVICE_PORT: number;
  CONTENT_SERVICE_PORT: number;
  ADMIN_SERVICE_PORT: number;
  
  // Database URLs
  AUTH_DB_URL: string;
  USER_DB_URL: string;
  MARKETPLACE_DB_URL: string;
  CART_DB_URL: string;
  ORDER_DB_URL: string;
  VENDOR_DB_URL: string;
  CONTENT_DB_URL: string;
  ADMIN_DB_URL: string;
  
  // Redis Configuration
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  REDIS_DB: number;
  
  // Kafka Configuration
  KAFKA_BROKERS: string[];
  KAFKA_CLIENT_ID: string;
  KAFKA_GROUP_ID: string;
  
  // Elasticsearch Configuration
  ELASTICSEARCH_URL: string;
  
  // JWT Configuration
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  
  // Email Configuration
  EMAIL_SMTP_HOST: string;
  EMAIL_SMTP_PORT: number;
  EMAIL_SMTP_SECURE: boolean;
  EMAIL_SMTP_USER: string;
  EMAIL_SMTP_PASSWORD: string;
  EMAIL_FROM: string;
  
  // OAuth Configuration
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_CALLBACK_URL?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_CALLBACK_URL?: string;
  
  // Payment Gateway Configuration
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  
  // File Upload Configuration
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_S3_BUCKET?: string;
  
  // CORS Configuration
  CORS_ORIGINS: string[];
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  
  // Logging
  LOG_LEVEL: string;
  LOG_FILE_PATH: string;
  
  // Frontend URL
  FRONTEND_URL: string;
}

class EnvConfigService {
  private config: EnvConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvConfig {
    return {
      // Node Environment
      NODE_ENV: process.env.NODE_ENV || 'development',
      
      // Service Ports
      API_GATEWAY_PORT: parseInt(process.env.API_GATEWAY_PORT || '4000', 10),
      AUTH_SERVICE_PORT: parseInt(process.env.AUTH_SERVICE_PORT || '4002', 10),
      USER_SERVICE_PORT: parseInt(process.env.USER_SERVICE_PORT || '4005', 10),
      MARKETPLACE_SERVICE_PORT: parseInt(process.env.MARKETPLACE_SERVICE_PORT || '4003', 10),
      CART_SERVICE_PORT: parseInt(process.env.CART_SERVICE_PORT || '4009', 10),
      ORDER_SERVICE_PORT: parseInt(process.env.ORDER_SERVICE_PORT || '4004', 10),
      VENDOR_SERVICE_PORT: parseInt(process.env.VENDOR_SERVICE_PORT || '4006', 10),
      CONTENT_SERVICE_PORT: parseInt(process.env.CONTENT_SERVICE_PORT || '4008', 10),
      ADMIN_SERVICE_PORT: parseInt(process.env.ADMIN_SERVICE_PORT || '4007', 10),
      
      // Database URLs
      AUTH_DB_URL: process.env.AUTH_DB_URL || 'mongodb://localhost:27017/auth_db',
      USER_DB_URL: process.env.USER_DB_URL || 'mongodb://localhost:27017/user_db',
      MARKETPLACE_DB_URL: process.env.MARKETPLACE_DB_URL || 'mongodb://localhost:27017/marketplace_db',
      CART_DB_URL: process.env.CART_DB_URL || 'mongodb://localhost:27017/cart_db',
      ORDER_DB_URL: process.env.ORDER_DB_URL || 'mongodb://localhost:27017/order_db',
      VENDOR_DB_URL: process.env.VENDOR_DB_URL || 'mongodb://localhost:27017/vendor_db',
      CONTENT_DB_URL: process.env.CONTENT_DB_URL || 'mongodb://localhost:27017/content_db',
      ADMIN_DB_URL: process.env.ADMIN_DB_URL || 'mongodb://localhost:27017/admin_db',
      
      // Redis Configuration
      REDIS_HOST: process.env.REDIS_HOST || 'localhost',
      REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),
      
      // Kafka Configuration
      KAFKA_BROKERS: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'autopilot-monster',
      KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'autopilot-monster-group',
      
      // Elasticsearch Configuration
      ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      
      // JWT Configuration
      JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      
      // Email Configuration
      EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
      EMAIL_SMTP_PORT: parseInt(process.env.EMAIL_SMTP_PORT || '587', 10),
      EMAIL_SMTP_SECURE: process.env.EMAIL_SMTP_SECURE === 'true',
      EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || '',
      EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD || '',
      EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@autopilot.monster',
      
      // OAuth Configuration
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/api/auth/github/callback',
      
      // Payment Gateway Configuration
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
      
      // File Upload Configuration
      AWS_REGION: process.env.AWS_REGION,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
      
      // CORS Configuration
      CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
      
      // Rate Limiting
      RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      
      // Logging
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      LOG_FILE_PATH: process.env.LOG_FILE_PATH || './logs',
      
      // Frontend URL
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    };
  }

  private validateConfig(): void {
    const requiredVars = ['JWT_SECRET'];
    const missing: string[] = [];

    for (const varName of requiredVars) {
      if (!this.config[varName as keyof EnvConfig]) {
        missing.push(varName);
      }
    }

    if (missing.length > 0 && this.config.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  public get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  public getAll(): EnvConfig {
    return { ...this.config };
  }

  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}

// Export singleton instance
export const envConfig = new EnvConfigService();

// Export individual getters for convenience
export const getEnv = <K extends keyof EnvConfig>(key: K): EnvConfig[K] => envConfig.get(key);
export const isDevelopment = (): boolean => envConfig.isDevelopment();
export const isProduction = (): boolean => envConfig.isProduction();
export const isTest = (): boolean => envConfig.isTest();

