# Implementation Guide - Autopilot Monster

## 🎯 Project Setup & Development Roadmap

This comprehensive guide provides a step-by-step approach to understanding and extending the Autopilot Monster marketplace. The platform is already built and production-ready, but this guide helps you understand the implementation and make additions.

## 📋 Prerequisites

### Development Environment

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: Latest version with Docker Compose
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions:
  - TypeScript and JavaScript Language Features
  - SCSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Docker extension

### Required Accounts (for deployment)

- **GitHub**: Code repository
- **MongoDB Atlas**: Database hosting (or use local Docker)
- **AWS/Cloudflare**: File storage and CDN (optional)
- **Stripe/Razorpay**: Payment processing
- **Vercel/Railway/AWS**: Deployment platform

## 🏗️ Current Project Structure

The project is already implemented with this structure:

```
autopilot.monster/
├── frontend/                     # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # React components
│   │   ├── lib/api/             # API client modules
│   │   └── styles/              # SCSS stylesheets
│   └── package.json
│
├── services/                     # 9 Microservices
│   ├── api-gateway-node/        # Port 4000
│   ├── auth-service-node/       # Port 4002
│   ├── user-service-node/       # Port 4005
│   ├── marketplace-service-node/# Port 4003
│   ├── cart-service-node/       # Port 4009
│   ├── order-service-node/      # Port 4004
│   ├── vendor-service-node/     # Port 4006
│   ├── content-service-node/    # Port 4008
│   └── admin-service-node/      # Port 4007
│
├── shared/                       # Shared configuration
│   ├── config/                  # DB, Redis, Kafka, Logger
│   ├── middleware/              # Shared middleware
│   ├── proto/                   # Protocol Buffers
│   └── utils/                   # Utility functions
│
├── docker-compose.yml           # Development Docker setup
├── docker-compose.prod.yml      # Production Docker setup
└── docs/                        # Documentation
```

## 📘 Phase 1: Understanding the Architecture

### Step 1: Review the Current Implementation

The system is built with:

1. **Frontend**: Next.js 15 with React 19
2. **Backend**: Node.js with Fastify framework
3. **Database**: MongoDB (separate DB per service)
4. **Caching**: Redis
5. **Event Streaming**: Apache Kafka
6. **Search**: Elasticsearch (optional)

### Step 2: Understand the Service Structure

Each microservice follows this pattern:

```typescript
services/[service-name]/
├── src/
│   ├── controllers/         # Route handlers
│   │   └── [service].controller.ts
│   ├── models/              # Database models
│   │   └── [model].model.ts
│   ├── routes/              # API routes
│   │   └── [service].routes.ts
│   ├── services/            # Business logic
│   │   └── [service].service.ts
│   ├── app.ts               # Fastify app setup
│   └── index.ts             # Service entry point
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Step 3: Study the Shared Module

The `shared/` directory contains:

```typescript
shared/
├── config/
│   ├── db.ts           # MongoDB connection manager
│   ├── redis.ts        # Redis client
│   ├── kafka.ts        # Kafka producer/consumer
│   ├── logger.ts       # Winston logging
│   └── env.ts          # Environment variables
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── validation.middleware.ts
└── utils/
    ├── response.util.ts
    └── swagger.util.ts
```

## 🔧 Phase 2: Local Development Setup

### Step 1: Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd autopilot.monster

# Install dependencies
npm install

# Install shared dependencies
cd shared && npm install && cd ..

# Install all service dependencies (automated)
./install-and-start.sh
```

### Step 2: Start Infrastructure

```bash
# Start MongoDB, Redis, Kafka, Elasticsearch
docker-compose up -d mongodb redis kafka zookeeper elasticsearch

# Verify services are running
docker-compose ps
```

### Step 3: Start All Services

```bash
# Start all 9 microservices
./start-all-services.sh

# Or start individually for development
cd services/auth-service-node && npm run dev
```

### Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

### Step 5: Verify Installation

```bash
# Check all services
curl http://localhost:4000/health

# Access Swagger docs
open http://localhost:4000/api-docs

# Access frontend
open http://localhost:3000
```

## 🎨 Phase 3: Adding a New Feature

### Example: Adding a "Favorites" Feature

#### Step 1: Plan the Feature

**Requirements**:
- Users can mark products as favorites
- View list of favorite products
- Remove from favorites
- Display favorite count

**Services to Modify**:
- User Service (add favorites endpoint)
- Frontend (add UI components)

#### Step 2: Update User Service

```typescript
// services/user-service-node/src/models/favorite.model.ts
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

export const Favorite = mongoose.model('Favorite', favoriteSchema);
```

```typescript
// services/user-service-node/src/controllers/user.controller.ts
async getFavorites(request, reply) {
  const userId = request.user.userId;
  const favorites = await Favorite.find({ userId });
  return reply.send({ success: true, data: favorites });
}

async addFavorite(request, reply) {
  const userId = request.user.userId;
  const { productId, productName } = request.body;
  
  const favorite = await Favorite.create({
    userId,
    productId,
    productName
  });
  
  return reply.status(201).send({ 
    success: true, 
    data: favorite 
  });
}

async removeFavorite(request, reply) {
  const userId = request.user.userId;
  const { productId } = request.params;
  
  await Favorite.deleteOne({ userId, productId });
  
  return reply.send({ success: true });
}
```

```typescript
// services/user-service-node/src/routes/user.routes.ts
export default async function userRoutes(fastify) {
  fastify.get('/favorites', {
    preHandler: [authMiddleware]
  }, userController.getFavorites);
  
  fastify.post('/favorites', {
    preHandler: [authMiddleware]
  }, userController.addFavorite);
  
  fastify.delete('/favorites/:productId', {
    preHandler: [authMiddleware]
  }, userController.removeFavorite);
}
```

#### Step 3: Update Frontend API Client

```typescript
// frontend/src/lib/api/user.api.ts
export const userApi = {
  // ... existing methods
  
  /**
   * Get favorites
   */
  getFavorites: async (token: string) => {
    return apiClient.get<{ success: boolean; data: Favorite[] }>(
      '/api/users/favorites',
      { token }
    );
  },
  
  /**
   * Add to favorites
   */
  addFavorite: async (token: string, productId: string, productName: string) => {
    return apiClient.post<{ success: boolean; data: Favorite }>(
      '/api/users/favorites',
      { productId, productName },
      { token }
    );
  },
  
  /**
   * Remove from favorites
   */
  removeFavorite: async (token: string, productId: string) => {
    return apiClient.delete<{ success: boolean }>(
      `/api/users/favorites/${productId}`,
      { token }
    );
  },
};
```

#### Step 4: Create Frontend Component

```typescript
// frontend/src/components/features/FavoriteButton.tsx
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { userApi } from '@/lib/api';
import styles from './FavoriteButton.module.scss';

export function FavoriteButton({ 
  productId, 
  productName, 
  initialFavorited = false 
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (favorited) {
        await userApi.removeFavorite(token, productId);
      } else {
        await userApi.addFavorite(token, productId, productName);
      }
      
      setFavorited(!favorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${styles.favoriteButton} ${favorited ? styles.favorited : ''}`}
    >
      <Heart fill={favorited ? 'currentColor' : 'none'} />
    </button>
  );
}
```

#### Step 5: Add to Product Page

```typescript
// frontend/src/app/product/[id]/page.tsx
import { FavoriteButton } from '@/components/features/FavoriteButton';

export default function ProductPage({ params }) {
  // ... existing code
  
  return (
    <div>
      <h1>{product.name}</h1>
      <FavoriteButton 
        productId={product.id} 
        productName={product.name}
      />
      {/* ... rest of product details */}
    </div>
  );
}
```

#### Step 6: Test the Feature

```bash
# Restart user service
cd services/user-service-node
npm run dev

# Test with curl
curl -X POST http://localhost:4000/api/users/favorites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"123","productName":"Test Product"}'

# Get favorites
curl http://localhost:4000/api/users/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 Phase 4: Adding a New Microservice

### Example: Creating a Notification Service

#### Step 1: Create Service Directory

```bash
mkdir -p services/notification-service-node/src/{controllers,models,routes,services}
cd services/notification-service-node
```

#### Step 2: Initialize Package

```bash
npm init -y
npm install fastify @fastify/cors @fastify/helmet @fastify/swagger \
            mongoose ioredis kafkajs winston dotenv
npm install -D typescript @types/node ts-node-dev
```

#### Step 3: Create TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### Step 4: Create Service Files

```typescript
// src/models/notification.model.ts
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    enum: ['order', 'payment', 'message', 'system'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);
```

```typescript
// src/services/notification.service.ts
import { Notification } from '../models/notification.model';
import { kafkaManager } from '../../../shared/config/kafka';

export class NotificationService {
  async createNotification(data) {
    const notification = await Notification.create(data);
    
    // Publish event
    await kafkaManager.publish('notification.created', {
      notificationId: notification._id,
      userId: notification.userId
    });
    
    return notification;
  }
  
  async getNotifications(userId: string) {
    return Notification.find({ userId }).sort({ createdAt: -1 });
  }
  
  async markAsRead(notificationId: string) {
    return Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  }
}
```

```typescript
// src/controllers/notification.controller.ts
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export const notificationController = {
  async getNotifications(request, reply) {
    const userId = request.user.userId;
    const notifications = await notificationService.getNotifications(userId);
    return reply.send({ success: true, data: notifications });
  },
  
  async markAsRead(request, reply) {
    const { id } = request.params;
    const notification = await notificationService.markAsRead(id);
    return reply.send({ success: true, data: notification });
  }
};
```

```typescript
// src/routes/notification.routes.ts
import { notificationController } from '../controllers/notification.controller';

export default async function notificationRoutes(fastify) {
  fastify.get('/', notificationController.getNotifications);
  fastify.put('/:id/read', notificationController.markAsRead);
}
```

```typescript
// src/app.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import notificationRoutes from './routes/notification.routes';

export async function createApp() {
  const app = Fastify({ logger: false });
  
  await app.register(cors);
  await app.register(helmet);
  
  app.register(notificationRoutes, { prefix: '/api/notifications' });
  
  app.get('/health', async () => ({ status: 'ok' }));
  
  return app;
}
```

```typescript
// src/index.ts
import { createApp } from './app';
import { connectDatabase } from '../../../shared/config/db';
import { logger } from '../../../shared/config/logger';

const PORT = parseInt(process.env.NOTIFICATION_SERVICE_PORT || '4010', 10);

async function start() {
  try {
    await connectDatabase('notification-service', process.env.NOTIFICATION_DB_URL);
    
    const app = await createApp();
    await app.listen({ port: PORT, host: '0.0.0.0' });
    
    logger.info(`Notification Service running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start Notification Service:', error);
    process.exit(1);
  }
}

start();
```

#### Step 5: Add to Docker Compose

```yaml
# docker-compose.prod.yml
notification-service:
  build:
    context: ./services/notification-service-node
    dockerfile: Dockerfile
  container_name: autopilot-notification-service
  restart: unless-stopped
  ports:
    - "4010:4010"
  environment:
    NODE_ENV: production
    NOTIFICATION_SERVICE_PORT: 4010
    NOTIFICATION_DB_URL: mongodb://admin:password123@mongodb:27017/notification_db?authSource=admin
    REDIS_HOST: redis
    REDIS_PORT: 6379
    REDIS_PASSWORD: password123
    KAFKA_BROKERS: kafka:29092
  depends_on:
    - mongodb
    - redis
    - kafka
  networks:
    - autopilot-network
```

#### Step 6: Update API Gateway

```typescript
// services/api-gateway-node/src/index.ts
await app.register(proxy, {
  upstream: 'http://notification-service:4010',
  prefix: '/api/notifications',
  rewritePrefix: '/api/notifications',
  http2: false,
});
```

## 📊 Phase 5: Performance Optimization

### Database Optimization

```typescript
// Add indexes to frequently queried fields
await Product.createIndex({ vendorId: 1, status: 1 });
await Product.createIndex({ category: 1, price: 1 });
await Product.createIndex({ name: 'text', description: 'text' });
await Order.createIndex({ userId: 1, createdAt: -1 });
```

### Redis Caching

```typescript
// Cache product listings
async function getProducts(filters) {
  const cacheKey = `products:${JSON.stringify(filters)}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query database
  const products = await Product.find(filters);
  
  // Store in cache (5 minutes)
  await redis.setex(cacheKey, 300, JSON.stringify(products));
  
  return products;
}
```

### Response Compression

```typescript
// Add compression to Fastify
import compression from '@fastify/compress';

await app.register(compression);
```

## 🧪 Phase 6: Testing

### Unit Tests

```typescript
// Example: auth.service.test.ts
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
  });
  
  test('should hash password', async () => {
    const password = 'Test123456';
    const hashed = await authService.hashPassword(password);
    expect(hashed).not.toBe(password);
  });
  
  test('should generate JWT token', () => {
    const user = { userId: '123', email: 'test@test.com' };
    const token = authService.generateAccessToken(user);
    expect(token).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Example: auth.api.test.ts
import { createApp } from './app';

describe('Auth API', () => {
  let app;
  
  beforeAll(async () => {
    app = await createApp();
  });
  
  test('POST /api/auth/register', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'test@test.com',
        password: 'Test123456',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    expect(response.statusCode).toBe(201);
    expect(response.json().success).toBe(true);
  });
});
```

## 📦 Phase 7: Deployment

### Build for Production

```bash
# Build all services
npm run build:services

# Build frontend
cd frontend && npm run build
```

### Docker Deployment

```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Variables

Create `.env.production`:

```env
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password

# Redis
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters

# Payment
STRIPE_SECRET_KEY=sk_live_your-stripe-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 🔍 Phase 8: Monitoring & Debugging

### View Logs

```bash
# Combined logs
tail -f logs/combined.log

# Service-specific logs
tail -f logs/auth-service.log

# Error logs only
tail -f logs/error.log
```

### Debug a Service

```bash
# Run in debug mode
NODE_ENV=development npm run dev

# Attach debugger (VS Code)
node --inspect dist/index.js
```

### Monitor Performance

```bash
# Check service health
curl http://localhost:4000/health

# Monitor Docker resources
docker stats

# View database connections
docker exec -it autopilot-mongodb mongosh -u admin -p password123
```

## 📚 Additional Resources

- [Technical Architecture](./technical-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [API Reference](./API_REFERENCE.md)
- [Setup Guide](./SETUP.md)
- [Deployment Guide](./deployment-guide.md)
- [Project Status](../PROJECT_STATUS.md)

## 🎯 Best Practices

1. **Code Style**: Follow TypeScript best practices
2. **Git**: Use conventional commits
3. **Testing**: Write tests for new features
4. **Documentation**: Document all new endpoints
5. **Security**: Never commit secrets
6. **Performance**: Cache frequently accessed data
7. **Error Handling**: Always handle errors gracefully
8. **Logging**: Log important events and errors

---

<div align="center">

**[⬆ Back to Top](#implementation-guide---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>
