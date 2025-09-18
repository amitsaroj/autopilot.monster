export default () => ({
  port: parseInt(process.env.PORT, 10) || 3007,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/autopilot_admin',
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'admin-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },

  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'admin-service',
    groupId: process.env.KAFKA_GROUP_ID || 'admin-service-group',
  },

  email: {
    smtp: {
      host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SMTP_PORT, 10) || 587,
      secure: process.env.EMAIL_SMTP_SECURE === 'true',
      user: process.env.EMAIL_SMTP_USER,
      password: process.env.EMAIL_SMTP_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'admin@autopilot.monster',
  },

  app: {
    name: 'Autopilot.Monster Admin',
    version: '1.0.0',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  },

  admin: {
    defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@autopilot.monster',
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
    sessionTimeout: parseInt(process.env.ADMIN_SESSION_TIMEOUT, 10) || 3600,
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION, 10) || 900, // 15 minutes
  },

  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },

  analytics: {
    retentionDays: parseInt(process.env.ANALYTICS_RETENTION_DAYS, 10) || 90,
    batchSize: parseInt(process.env.ANALYTICS_BATCH_SIZE, 10) || 1000,
  },
});
