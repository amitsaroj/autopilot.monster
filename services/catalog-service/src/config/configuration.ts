export default () => ({
  port: parseInt(process.env.PORT, 10) || 3003,
  nodeEnv: process.env.NODE_ENV || 'development',
  grpcUrl: process.env.GRPC_URL || 'localhost:3003',
  
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/autopilot_catalog',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  },

  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: 'catalog-service',
    groupId: 'catalog-service-group',
  },

  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    index: 'products',
  },

  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      s3Bucket: process.env.AWS_S3_BUCKET || 'autopilot-assets',
    },
  },

  features: {
    enableSearch: process.env.ENABLE_SEARCH !== 'false',
    enableFileUpload: process.env.ENABLE_FILE_UPLOAD !== 'false',
    enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
  },

  limits: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024, // 50MB
    maxFilesPerProduct: parseInt(process.env.MAX_FILES_PER_PRODUCT, 10) || 10,
    maxScreenshots: parseInt(process.env.MAX_SCREENSHOTS, 10) || 5,
  },
});
