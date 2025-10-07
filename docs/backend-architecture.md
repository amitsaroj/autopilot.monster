# Backend Architecture - Autopilot Monster

## 📋 Overview

This document provides comprehensive details about the Node.js/Fastify microservices architecture powering the Autopilot Monster marketplace platform.

## 🏗️ Architecture Pattern

### Microservices Structure

```
autopilot.monster/
├── services/
│   ├── api-gateway-node/          # API Gateway (Port 4000)
│   ├── auth-service-node/         # Authentication (Port 4002)
│   ├── user-service-node/         # User Management (Port 4005)
│   ├── marketplace-service-node/  # Product Catalog (Port 4003)
│   ├── cart-service-node/         # Shopping Cart (Port 4009)
│   ├── order-service-node/        # Order Management (Port 4004)
│   ├── vendor-service-node/       # Vendor Management (Port 4006)
│   ├── content-service-node/      # Content Management (Port 4008)
│   └── admin-service-node/        # Admin Operations (Port 4007)
├── shared/
│   ├── config/                    # Shared Configuration
│   │   ├── db.ts                 # MongoDB connection manager
│   │   ├── env.ts                # Environment variables
│   │   ├── kafka.ts              # Kafka producer/consumer
│   │   ├── logger.ts             # Winston logging
│   │   └── redis.ts              # Redis client
│   ├── middleware/                # Shared Middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── proto/                     # Protocol Buffers
│   ├── types/                     # Shared TypeScript types
│   └── utils/                     # Utility functions
├── frontend/                      # Next.js Frontend
└── docker-compose.prod.yml        # Production deployment
```

## 🎯 Service Details

### 1. API Gateway (Port 4000)

**Technology**: Fastify with HTTP Proxy

**Responsibilities**:
- Request routing to microservices
- Load balancing
- Rate limiting
- Unified Swagger documentation aggregation
- Health check aggregation
- CORS handling
- Security headers

**Key Features**:
```typescript
// API Gateway Structure
services/api-gateway-node/
├── src/
│   └── index.ts              # Main gateway file
├── Dockerfile
├── package.json
└── tsconfig.json
```

**Implementation**:
```typescript
import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

const app = Fastify({ logger: false });

// Proxy routes
await app.register(proxy, {
  upstream: 'http://auth-service:4002',
  prefix: '/api/auth',
  rewritePrefix: '/api/auth',
});

// Health check aggregates all services
app.get('/health', async () => {
  const serviceHealth = await checkAllServices();
  return { status: 'ok', services: serviceHealth };
});
```

**Environment Variables**:
```env
API_GATEWAY_PORT=4000
AUTH_SERVICE_URL=http://localhost:4002
USER_SERVICE_URL=http://localhost:4005
MARKETPLACE_SERVICE_URL=http://localhost:4003
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

---

### 2. Auth Service (Port 4002)

**Technology**: Fastify + MongoDB + Redis + Kafka

**Database**: `auth_db` (MongoDB)

**Responsibilities**:
- User registration
- Login with JWT tokens
- Refresh token mechanism
- Password reset
- Account activation
- Token blacklisting
- OAuth integration (ready)

**Structure**:
```typescript
services/auth-service-node/
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts    # Route handlers
│   ├── models/
│   │   └── user.model.ts         # Mongoose schemas
│   ├── routes/
│   │   └── auth.routes.ts        # API routes
│   ├── services/
│   │   └── auth.service.ts       # Business logic
│   ├── app.ts                     # Fastify app setup
│   └── index.ts                   # Service entry point
├── Dockerfile
├── package.json
└── tsconfig.json
```

**API Endpoints**:
```typescript
POST /api/auth/register          # Register new user
POST /api/auth/login             # User login
POST /api/auth/logout            # Logout (invalidate token)
POST /api/auth/refresh           # Refresh access token
POST /api/auth/forgot-password   # Request password reset
POST /api/auth/reset-password    # Reset password with token
GET  /api/auth/verify/:token     # Verify email
```

**Key Implementation**:
```typescript
// auth.service.ts
export class AuthService {
  async register(data: RegisterDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Create user
    const user = await User.create({
      ...data,
      password: hashedPassword
    });
    
    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    // Publish event to Kafka
    await kafkaManager.publish('user.registered', {
      userId: user._id,
      email: user.email
    });
    
    return { user, accessToken, refreshToken };
  }
}
```

**Database Schema**:
```typescript
// user.model.ts
interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isActive: boolean;
  role: 'user' | 'vendor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 3. User Service (Port 4005)

**Technology**: Fastify + MongoDB + Kafka

**Database**: `user_db` (MongoDB)

**Responsibilities**:
- User profile management
- Wishlist functionality
- Subscription management
- User preferences
- Dashboard data
- Account settings

**Structure**:
```typescript
services/user-service-node/
├── src/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── models/
│   │   ├── profile.model.ts      # User profiles
│   │   ├── wishlist.model.ts     # Wishlist items
│   │   └── subscription.model.ts # Subscriptions
│   ├── routes/
│   │   └── user.routes.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── app.ts
│   └── index.ts
├── Dockerfile
└── package.json
```

**API Endpoints**:
```typescript
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update profile
GET    /api/users/dashboard        # Dashboard data
GET    /api/users/wishlist         # Get wishlist
POST   /api/users/wishlist         # Add to wishlist
DELETE /api/users/wishlist/:id     # Remove from wishlist
GET    /api/users/subscriptions    # Get subscriptions
POST   /api/users/subscriptions    # Create subscription
```

**Kafka Events Consumed**:
```typescript
// Listens to user.registered from Auth Service
kafkaManager.consume('user.registered', async (event) => {
  await UserProfile.create({
    userId: event.userId,
    email: event.email,
    // Initialize default profile
  });
});
```

---

### 4. Marketplace Service (Port 4003)

**Technology**: Fastify + MongoDB + Elasticsearch + Kafka

**Database**: `marketplace_db` (MongoDB)

**Responsibilities**:
- Product catalog management
- Product search and filtering
- Categories management
- Product reviews and ratings
- Featured/popular products
- Vendor product listings

**Structure**:
```typescript
services/marketplace-service-node/
├── src/
│   ├── controllers/
│   │   └── marketplace.controller.ts
│   ├── models/
│   │   ├── product.model.ts      # Products
│   │   ├── category.model.ts     # Categories
│   │   └── review.model.ts       # Reviews
│   ├── routes/
│   │   └── marketplace.routes.ts
│   ├── services/
│   │   └── marketplace.service.ts
│   ├── app.ts
│   └── index.ts
```

**API Endpoints**:
```typescript
GET    /api/marketplace/products          # List products (paginated)
GET    /api/marketplace/products/:id      # Get product details
POST   /api/marketplace/products          # Create product (vendor)
PUT    /api/marketplace/products/:id      # Update product (vendor)
DELETE /api/marketplace/products/:id      # Delete product (vendor)
GET    /api/marketplace/categories        # List categories
GET    /api/marketplace/products/:id/reviews  # Product reviews
POST   /api/marketplace/products/:id/reviews  # Add review
```

**Product Schema**:
```typescript
interface IProduct {
  vendorId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  images: string[];
  thumbnail?: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  status: 'active' | 'pending' | 'rejected' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 5. Cart Service (Port 4009)

**Technology**: Fastify + MongoDB + Redis

**Database**: `cart_db` (MongoDB)

**Responsibilities**:
- Shopping cart CRUD operations
- Cart item management
- Price calculations
- Cart persistence
- Session-based and user-based carts

**Structure**:
```typescript
services/cart-service-node/
├── src/
│   ├── controllers/
│   │   └── cart.controller.ts
│   ├── models/
│   │   └── cart.model.ts
│   ├── routes/
│   │   └── cart.routes.ts
│   ├── services/
│   │   └── cart.service.ts
│   ├── app.ts
│   └── index.ts
```

**API Endpoints**:
```typescript
GET    /api/cart              # Get cart
POST   /api/cart/items        # Add item to cart
PUT    /api/cart/items/:id    # Update item quantity
DELETE /api/cart/items/:id    # Remove item
DELETE /api/cart              # Clear cart
```

**Cart Schema**:
```typescript
interface ICart {
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    thumbnail?: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  updatedAt: Date;
  expiresAt: Date;
}
```

---

### 6. Order Service (Port 4004)

**Technology**: Fastify + MongoDB + Stripe/Razorpay + Kafka

**Database**: `order_db` (MongoDB)

**Responsibilities**:
- Order creation and management
- Payment processing (Stripe/Razorpay)
- Order status tracking
- Order history
- Transaction logs
- Payment webhook handling

**Structure**:
```typescript
services/order-service-node/
├── src/
│   ├── controllers/
│   │   └── order.controller.ts
│   ├── models/
│   │   ├── order.model.ts
│   │   └── payment.model.ts
│   ├── routes/
│   │   └── order.routes.ts
│   ├── services/
│   │   └── order.service.ts
│   ├── app.ts
│   └── index.ts
```

**API Endpoints**:
```typescript
POST   /api/orders                    # Create order
GET    /api/orders                    # List orders
GET    /api/orders/:id                # Get order details
POST   /api/orders/:id/payment        # Process payment
POST   /api/orders/:id/cancel         # Cancel order
GET    /api/orders/payment-methods    # Get payment methods
POST   /api/orders/webhooks/stripe    # Stripe webhook
POST   /api/orders/webhooks/razorpay  # Razorpay webhook
```

**Order Schema**:
```typescript
interface IOrder {
  orderId: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'razorpay';
  paymentIntent?: string;
  billingAddress: object;
  createdAt: Date;
  updatedAt: Date;
}
```

**Payment Integration**:
```typescript
// Stripe payment
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async createPayment(order) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.total * 100,
    currency: 'usd',
    metadata: { orderId: order.orderId }
  });
  
  return paymentIntent;
}
```

---

### 7. Vendor Service (Port 4006)

**Technology**: Fastify + MongoDB + Kafka

**Database**: `vendor_db` (MongoDB)

**Responsibilities**:
- Vendor registration and onboarding
- Product management for vendors
- Analytics dashboard
- Earnings tracking
- Payout requests
- Vendor profile management

**Structure**:
```typescript
services/vendor-service-node/
├── src/
│   ├── controllers/
│   │   └── vendor.controller.ts
│   ├── models/
│   │   ├── vendor.model.ts
│   │   └── payout.model.ts
│   ├── routes/
│   │   └── vendor.routes.ts
│   ├── services/
│   │   └── vendor.service.ts
│   ├── app.ts
│   └── index.ts
```

**API Endpoints**:
```typescript
GET    /api/vendors/profile          # Get vendor profile
PUT    /api/vendors/profile          # Update profile
GET    /api/vendors/products         # List vendor products
POST   /api/vendors/products         # Create product
PUT    /api/vendors/products/:id     # Update product
DELETE /api/vendors/products/:id     # Delete product
GET    /api/vendors/analytics        # Get analytics
GET    /api/vendors/earnings         # Get earnings
POST   /api/vendors/payouts          # Request payout
```

**Vendor Schema**:
```typescript
interface IVendor {
  vendorId: string;
  userId: string;
  name: string;
  description: string;
  email: string;
  phone?: string;
  website?: string;
  avatar?: string;
  verified: boolean;
  status: 'active' | 'pending' | 'suspended';
  productsCount: number;
  totalRevenue: number;
  averageRating: number;
  joinDate: Date;
}
```

---

### 8. Content Service (Port 4008)

**Technology**: Fastify + MongoDB

**Database**: `content_db` (MongoDB)

**Responsibilities**:
- Blog post management
- Tutorial system
- Help article management
- Job listings
- Content categories
- SEO optimization

**Structure**:
```typescript
services/content-service-node/
├── src/
│   ├── controllers/
│   │   └── content.controller.ts
│   ├── models/
│   │   ├── blog.model.ts
│   │   └── tutorial.model.ts
│   ├── routes/
│   │   └── content.routes.ts
│   ├── services/
│   │   └── content.service.ts
│   ├── app.ts
│   └── index.ts
```

**API Endpoints**:
```typescript
GET    /api/content/blog             # List blog posts
GET    /api/content/blog/:slug       # Get blog post
POST   /api/content/blog             # Create post (admin)
PUT    /api/content/blog/:id         # Update post (admin)
DELETE /api/content/blog/:id         # Delete post (admin)
GET    /api/content/help             # List help articles
GET    /api/content/help/:slug       # Get help article
GET    /api/content/jobs             # List job openings
POST   /api/content/jobs/:id/apply   # Apply for job
```

---

### 9. Admin Service (Port 4007)

**Technology**: Fastify + MongoDB + Kafka

**Database**: `admin_db` (MongoDB)

**Responsibilities**:
- User management (view, update, delete)
- Vendor approval system
- Product moderation
- Platform analytics
- System settings
- Approval workflows

**Structure**:
```typescript
services/admin-service-node/
├── src/
│   ├── controllers/
│   │   └── admin.controller.ts
│   ├── models/
│   │   ├── admin.model.ts
│   │   └── approval.model.ts
│   ├── routes/
│   │   └── admin.routes.ts
│   ├── services/
│   │   └── admin.service.ts
│   ├── app.ts
│   └── index.ts
```

**API Endpoints**:
```typescript
GET    /api/admin/dashboard          # Dashboard stats
GET    /api/admin/users              # List users
GET    /api/admin/users/:id          # Get user details
PUT    /api/admin/users/:id          # Update user
DELETE /api/admin/users/:id          # Delete user
GET    /api/admin/vendors            # List vendors
POST   /api/admin/vendors/:id/approve    # Approve vendor
POST   /api/admin/vendors/:id/reject     # Reject vendor
GET    /api/admin/products           # List products
POST   /api/admin/products/:id/approve   # Approve product
POST   /api/admin/products/:id/reject    # Reject product
```

---

## 🔗 Shared Infrastructure

### Shared Configuration Module

**Location**: `shared/config/`

**Purpose**: Centralized configuration for all services

**Files**:

1. **db.ts** - MongoDB Connection Manager
```typescript
export class DatabaseManager {
  async connect(serviceName: string, uri: string) {
    const connection = await mongoose.createConnection(uri).asPromise();
    this.connections.set(serviceName, connection);
    return connection;
  }
}
```

2. **redis.ts** - Redis Client Manager
```typescript
export class RedisManager {
  private client: Redis;
  
  async getClient() {
    if (!this.client) {
      this.client = new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
      });
    }
    return this.client;
  }
}
```

3. **kafka.ts** - Kafka Producer/Consumer
```typescript
export class KafkaManager {
  async publish(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
  }
  
  async consume(topic: string, handler: Function) {
    await this.consumer.subscribe({ topic });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        await handler(data);
      }
    });
  }
}
```

4. **logger.ts** - Winston Logger
```typescript
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

5. **env.ts** - Environment Variables Manager
```typescript
export class EnvConfig {
  get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }
}
```

### Shared Middleware

**Location**: `shared/middleware/`

1. **auth.middleware.ts** - JWT Authentication
2. **error.middleware.ts** - Error Handling
3. **rateLimit.middleware.ts** - Rate Limiting
4. **validation.middleware.ts** - Input Validation

---

## 🔄 Inter-Service Communication

### 1. Synchronous (HTTP)

Via API Gateway:
```
Client → API Gateway → Service A
```

### 2. Asynchronous (Kafka Events)

```
Service A publishes event → Kafka → Service B consumes
```

**Event Examples**:
- `user.registered` - New user signup
- `order.created` - New order placed
- `payment.success` - Payment completed
- `product.created` - New product added
- `vendor.approved` - Vendor activated

---

## 📊 Performance Metrics

### Fastify vs NestJS

| Metric | NestJS | Fastify | Improvement |
|--------|--------|---------|-------------|
| Requests/sec | 30,000 | 70,000 | +133% |
| Startup Time | 3-5s | 1-2s | -60% |
| Memory Usage | 200MB | 80MB | -60% |
| Response Time | 50ms | 20ms | -60% |

---

## 🔐 Security Measures

1. **Authentication**: JWT with refresh tokens
2. **Password Security**: bcrypt with 10 rounds
3. **Rate Limiting**: Redis-backed, per-IP
4. **Input Validation**: All endpoints validated
5. **CORS**: Configured for allowed origins
6. **Helmet**: Security headers enabled
7. **SQL Injection**: MongoDB prevents it
8. **XSS**: React escapes by default

---

## 📚 Related Documentation

- [Technical Architecture](./technical-architecture.md)
- [Backend Services](./backend-services.md)
- [API Reference](./API_REFERENCE.md)
- [Setup Guide](./SETUP.md)
- [Deployment Guide](./deployment-guide.md)

---

<div align="center">

**[⬆ Back to Top](#backend-architecture---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>
