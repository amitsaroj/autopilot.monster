export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/autopilot-auth',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
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
      redirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback',
    },
    github: {
      clientId: process.env.OAUTH_GITHUB_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET || 'dummy-client-secret',
      redirectUri: process.env.OAUTH_GITHUB_REDIRECT_URI || 'http://localhost:3001/auth/github/callback',
    },
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
      from: process.env.SMTP_FROM || 'noreply@autopilot.monster',
    },
    templatesDir: process.env.EMAIL_TEMPLATES_DIR || './src/email/templates',
  },
  grpc: {
    url: process.env.GRPC_URL || 'localhost:50051',
  },
});