export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/autopilot-monster',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  oauth: {
    google: {
      clientId: process.env.OAUTH_GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
      redirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
    },
    github: {
      clientId: process.env.OAUTH_GITHUB_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET || 'dummy-client-secret',
      redirectUri: process.env.OAUTH_GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback',
    },
  },
  services: {
    auth: {
      url: process.env.SERVICES_AUTH_URL || 'localhost:3001',
    },
    catalog: {
      url: process.env.SERVICES_CATALOG_URL || 'localhost:3002',
    },
    payment: {
      url: process.env.SERVICES_PAYMENT_URL || 'localhost:3003',
    },
    user: {
      url: process.env.SERVICES_USER_URL || 'localhost:3004',
    },
    vendor: {
      url: process.env.SERVICES_VENDOR_URL || 'localhost:3005',
    },
    admin: {
      url: process.env.SERVICES_ADMIN_URL || 'localhost:3006',
    },
    content: {
      url: process.env.SERVICES_CONTENT_URL || 'localhost:3007',
    },
    license: {
      url: process.env.SERVICES_LICENSE_URL || 'localhost:3008',
    },
    notification: {
      url: process.env.SERVICES_NOTIFICATION_URL || 'localhost:3009',
    },
  },
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'api-gateway',
  },
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password',
    },
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
    ],
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  },
  grpc: {
    options: {
      keepalive: {
        keepaliveTimeMs: 30000,
        keepaliveTimeoutMs: 5000,
        keepalivePermitWithoutCalls: true,
        http2MaxPingsWithoutData: 0,
        http2MinTimeBetweenPingsMs: 10000,
      },
    },
  },
});