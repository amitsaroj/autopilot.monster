export default () => ({
  port: parseInt(process.env.PORT, 10) || 3004,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  app: {
    name: 'Payment Service',
    version: process.env.APP_VERSION || '1.0.0',
    description: 'Autopilot.Monster Payment Service',
  },

  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/autopilot_payment',
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },

  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: 'payment-service',
    groupId: 'payment-service-group',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...',
    apiVersion: '2023-10-16',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_...',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'your-razorpay-secret',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'your-webhook-secret',
  },

  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || 'your-paypal-client-id',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'your-paypal-secret',
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox', // sandbox or live
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION, 10) || 15 * 60 * 1000, // 15 minutes
    passwordResetExpiry: parseInt(process.env.PASSWORD_RESET_EXPIRY, 10) || 60 * 60 * 1000, // 1 hour
  },

  features: {
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
    enablePasswordHistory: process.env.ENABLE_PASSWORD_HISTORY === 'true',
    enableTwoFactor: process.env.ENABLE_TWO_FACTOR === 'true',
    enableRateLimiting: process.env.ENABLE_RATE_LIMITING === 'true',
  },

  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      password: process.env.SMTP_PASSWORD || 'your-app-password',
    },
    from: process.env.EMAIL_FROM || 'noreply@autopilot.monster',
  },

  grpc: {
    url: process.env.GRPC_URL || 'localhost:3004',
  },

  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT, 10) || 9090,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
});
