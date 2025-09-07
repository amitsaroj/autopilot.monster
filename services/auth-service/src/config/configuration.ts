export default () => ({
  // Server configuration
  port: parseInt(process.env.PORT, 10) || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  grpcUrl: process.env.GRPC_URL || 'localhost:3002',
  
  // Database configuration
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/autopilot_auth',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION, 10) || 900000, // 15 minutes
    passwordResetExpiry: parseInt(process.env.PASSWORD_RESET_EXPIRY, 10) || 3600000, // 1 hour
  },

  // OAuth configuration
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  // Message queue configuration
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: 'auth-service',
    groupId: 'auth-service-group',
  },

  // NATS configuration  
  nats: {
    url: process.env.NATS_URL || 'nats://localhost:4222',
  },

  // Email configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASS,
    },
    from: process.env.EMAIL_FROM || 'noreply@autopilot.monster',
  },

  // Rate limiting
  rateLimit: {
    loginAttempts: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 login attempts per windowMs
    },
    registration: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // limit each IP to 3 registrations per windowMs
    },
  },

  // Session configuration
  session: {
    duration: parseInt(process.env.SESSION_DURATION, 10) || 86400000, // 24 hours
    extendedDuration: parseInt(process.env.EXTENDED_SESSION_DURATION, 10) || 604800000, // 7 days
  },

  // Feature flags
  features: {
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION !== 'false',
    enableTwoFactor: process.env.ENABLE_TWO_FACTOR !== 'false',
    enableOAuth: process.env.ENABLE_OAUTH !== 'false',
    enablePasswordHistory: process.env.ENABLE_PASSWORD_HISTORY !== 'false',
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    openTelemetry: {
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      serviceName: 'auth-service',
    },
  },
});
