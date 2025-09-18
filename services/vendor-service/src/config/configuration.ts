export default () => ({
  // Server configuration
  port: parseInt(process.env.PORT, 10) || 3008,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/autopilot_vendors',
    },
  },

  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.REDIS_TTL, 10) || 3600, // 1 hour
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // Microservices configuration
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'localhost:3002',
    },
    catalog: {
      url: process.env.CATALOG_SERVICE_URL || 'localhost:3003',
    },
    payment: {
      url: process.env.PAYMENT_SERVICE_URL || 'localhost:3004',
    },
    user: {
      url: process.env.USER_SERVICE_URL || 'localhost:3007',
    },
  },

  // Message queue configuration
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: 'vendor-service',
    groupId: 'vendor-service-group',
  },

  // gRPC configuration
  grpc: {
    options: {
      'grpc.keepalive_time_ms': 120000,
      'grpc.keepalive_timeout_ms': 5000,
      'grpc.keepalive_permit_without_calls': true,
      'grpc.http2.max_pings_without_data': 0,
      'grpc.http2.min_time_between_pings_ms': 10000,
    },
  },

  // NATS configuration  
  nats: {
    url: process.env.NATS_URL || 'nats://localhost:4222',
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
    },
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
    ],
  },

  // KYC configuration
  kyc: {
    provider: process.env.KYC_PROVIDER || 'mock',
    apiKey: process.env.KYC_API_KEY,
    apiSecret: process.env.KYC_API_SECRET,
    webhookSecret: process.env.KYC_WEBHOOK_SECRET,
  },

  // Payout configuration
  payout: {
    provider: process.env.PAYOUT_PROVIDER || 'stripe',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    minimumPayoutAmount: parseFloat(process.env.MINIMUM_PAYOUT_AMOUNT) || 50.00,
    payoutSchedule: process.env.PAYOUT_SCHEDULE || 'weekly', // daily, weekly, monthly
  },

  // Analytics configuration
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true',
    batchSize: parseInt(process.env.ANALYTICS_BATCH_SIZE, 10) || 100,
    flushInterval: parseInt(process.env.ANALYTICS_FLUSH_INTERVAL, 10) || 5000, // 5 seconds
  },
});
