# Backend Services - Autopilot Monster

## 🏗️ Microservices Overview

The Autopilot Monster backend consists of 9 independent Node.js microservices built with Fastify, providing scalable, maintainable, and production-ready services. Each service follows domain-driven design principles and communicates via REST APIs and Apache Kafka events.

## 🔧 Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Fastify** | 4.26+ | High-performance web framework (70k req/s) |
| **TypeScript** | 5.3+ | Type-safe development |
| **MongoDB** | 7.0+ | NoSQL database (per service) |
| **Mongoose** | 8.1+ | MongoDB ODM |
| **Redis** | 7.2+ | Caching & session storage |
| **Apache Kafka** | 7.4+ | Event streaming platform |
| **KafkaJS** | 2.2+ | Kafka client for Node.js |
| **IORedis** | 5.3+ | Redis client |
| **Winston** | 3.11+ | Logging framework |
| **bcryptjs** | 2.4+ | Password hashing |
| **jsonwebtoken** | 9.0+ | JWT authentication |
| **@fastify/swagger** | 8.14+ | API documentation |
| **@fastify/cors** | 9.0+ | CORS handling |
| **@fastify/helmet** | 11.1+ | Security headers |

## 🏢 Service Catalog

### 1. API Gateway Service

**Port**: 4000  
**Purpose**: Single entry point for all client requests
**Technology**: Fastify + HTTP Proxy

#### Key Features
- ✅ Request routing to microservices
- ✅ Load balancing
- ✅ Rate limiting (Redis-backed)
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Unified Swagger documentation
- ✅ Health check aggregation

#### Project Structure
```
services/api-gateway-node/
├── src/
│   └── index.ts              # Main gateway file
├── Dockerfile
├── package.json
└── tsconfig.json
```

#### Core Implementation
```typescript
// src/index.ts
import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

const app = Fastify({ logger: false });

// Security middleware
await app.register(helmet);
await app.register(cors, {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
});

// Rate limiting
await app.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
  redis: redisClient
});

// Proxy routes
await app.register(proxy, {
  upstream: 'http://auth-service:4002',
  prefix: '/api/auth',
  rewritePrefix: '/api/auth',
  http2: false,
});

await app.register(proxy, {
  upstream: 'http://marketplace-service:4003',
  prefix: '/api/marketplace',
  rewritePrefix: '/api/marketplace',
  http2: false,
});

// Health endpoint
app.get('/health', async () => {
  const services = await checkAllServices();
  return { status: 'ok', services };
});

// Start server
await app.listen({ port: 4000, host: '0.0.0.0' });
```

#### Environment Variables
```env
API_GATEWAY_PORT=4000
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
REDIS_HOST=redis
REDIS_PORT=6379
```

---

### 2. Auth Service

**Port**: 4002  
**Database**: `auth_db` (MongoDB)  
**Purpose**: Authentication & Authorization

#### Key Features
- ✅ User registration with email verification
- ✅ Login with JWT tokens (access + refresh)
- ✅ Password reset functionality
- ✅ Token refresh mechanism
- ✅ Token blacklisting (Redis)
- ✅ OAuth 2.0 ready
- ✅ Role-based access control

#### Project Structure
```
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

#### User Model
```typescript
// src/models/user.model.ts
import mongoose from 'mongoose';

interface IUser {
  email: string;
  password: string;
    firstName: string;
    lastName: string;
  role: 'user' | 'vendor' | 'admin';
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { 
    type: String,
    required: true,
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true,
    select: false 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String,
    enum: ['user', 'vendor', 'admin'], 
    default: 'user' 
  },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

export const User = mongoose.model<IUser>('User', userSchema);
```

#### Auth Service Implementation
```typescript
// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { kafkaManager } from '../../../shared/config/kafka';

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
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      timestamp: new Date().toISOString()
    });
    
    return { 
      user: this.sanitizeUser(user), 
      accessToken, 
      refreshToken 
    };
  }
  
  async login(email: string, password: string) {
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    // Publish event
    await kafkaManager.publish('user.logged-in', {
      userId: user._id.toString(),
      email: user.email,
      timestamp: new Date().toISOString()
    });

    return {
      user: this.sanitizeUser(user), 
      accessToken, 
      refreshToken 
    };
  }
  
  generateAccessToken(user: any) {
    return jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  }
  
  generateRefreshToken(user: any) {
    return jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
  }
  
  sanitizeUser(user: any) {
    const { password, ...sanitized } = user.toObject();
    return sanitized;
  }
}
```

#### API Endpoints
```
POST /api/auth/register          # Register new user
POST /api/auth/login             # User login
POST /api/auth/logout            # Logout user
POST /api/auth/refresh           # Refresh access token
POST /api/auth/forgot-password   # Request password reset
POST /api/auth/reset-password    # Reset password
GET  /api/auth/verify/:token     # Verify email
GET  /api/auth/profile           # Get current user profile
```

#### Kafka Events Published
- `user.registered` - When new user signs up
- `user.logged-in` - When user logs in

---

### 3. Marketplace Service

**Port**: 4003  
**Database**: `marketplace_db` (MongoDB)  
**Purpose**: Product catalog management

#### Key Features
- ✅ Product CRUD operations
- ✅ Category management
- ✅ Product reviews & ratings
- ✅ Search & filtering
- ✅ Featured/popular products
- ✅ Vendor product listings
- ✅ Elasticsearch integration (optional)

#### Project Structure
```
services/marketplace-service-node/
├── src/
│   ├── controllers/
│   │   └── marketplace.controller.ts
│   ├── models/
│   │   ├── product.model.ts
│   │   ├── category.model.ts
│   │   └── review.model.ts
│   ├── routes/
│   │   └── marketplace.routes.ts
│   ├── services/
│   │   └── marketplace.service.ts
│   ├── app.ts
│   └── index.ts
```

#### Product Model
```typescript
// src/models/product.model.ts
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

const productSchema = new mongoose.Schema<IProduct>({
  vendorId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: { type: String, required: true, index: true },
  tags: [{ type: String }],
  images: [{ type: String }],
  thumbnail: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'rejected', 'draft'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Indexes for performance
productSchema.index({ vendorId: 1, status: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
```

#### API Endpoints
```
GET    /api/marketplace/products          # List products
GET    /api/marketplace/products/:id      # Get product details
POST   /api/marketplace/products          # Create product (vendor)
PUT    /api/marketplace/products/:id      # Update product (vendor)
DELETE /api/marketplace/products/:id      # Delete product (vendor)
GET    /api/marketplace/categories        # List categories
GET    /api/marketplace/products/:id/reviews  # Get reviews
POST   /api/marketplace/products/:id/reviews  # Add review
```

#### Kafka Events Published
- `product.created` - New product added
- `product.updated` - Product modified
- `product.deleted` - Product removed

---

### 4. Cart Service

**Port**: 4009  
**Database**: `cart_db` (MongoDB)  
**Purpose**: Shopping cart management

#### Key Features
- ✅ Add/remove items
- ✅ Update quantities
- ✅ Cart persistence
- ✅ Price calculations
- ✅ Session-based carts
- ✅ Auto-expiration

#### Cart Model
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

const cartSchema = new mongoose.Schema<ICart>({
  userId: { type: String, required: true, unique: true, index: true },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    thumbnail: { type: String }
  }],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
  }
}, { timestamps: true });

// Auto-delete expired carts
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
```

#### API Endpoints
```
GET    /api/cart              # Get cart
POST   /api/cart/items        # Add item
PUT    /api/cart/items/:id    # Update item
DELETE /api/cart/items/:id    # Remove item
DELETE /api/cart              # Clear cart
```

---

### 5. Order Service

**Port**: 4004  
**Database**: `order_db` (MongoDB)  
**Purpose**: Order & payment processing

#### Key Features
- ✅ Order creation & management
- ✅ Stripe integration
- ✅ Razorpay integration
- ✅ Payment webhook handling
- ✅ Order status tracking
- ✅ Transaction logs

#### Order Model
```typescript
interface IOrder {
  orderId: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    vendorId: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'razorpay';
  paymentIntent?: string;
  billingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  orderId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    vendorId: { type: String, required: true }
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { 
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: { type: String, required: true },
  paymentIntent: { type: String },
  billingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true }
  }
}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
```

#### Payment Integration
```typescript
// Stripe
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async createPaymentIntent(order: IOrder) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // cents
    currency: 'usd',
    metadata: {
      orderId: order.orderId,
      userId: order.userId
    }
  });
  
  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
}
```

#### API Endpoints
```
POST   /api/orders                    # Create order
GET    /api/orders                    # List orders
GET    /api/orders/:id                # Get order
POST   /api/orders/:id/payment        # Process payment
POST   /api/orders/:id/cancel         # Cancel order
POST   /api/orders/webhooks/stripe    # Stripe webhook
POST   /api/orders/webhooks/razorpay  # Razorpay webhook
```

#### Kafka Events Published
- `order.created` - New order created
- `payment.success` - Payment completed
- `payment.failed` - Payment failed
- `order.cancelled` - Order cancelled

---

### 6. User Service

**Port**: 4005  
**Database**: `user_db` (MongoDB)  
**Purpose**: User profile & preferences

#### Key Features
- ✅ User profile management
- ✅ Wishlist functionality
- ✅ Subscription management
- ✅ Dashboard data
- ✅ Purchase history

#### API Endpoints
```
GET    /api/users/profile          # Get profile
PUT    /api/users/profile          # Update profile
GET    /api/users/dashboard        # Dashboard data
GET    /api/users/wishlist         # Get wishlist
POST   /api/users/wishlist         # Add to wishlist
DELETE /api/users/wishlist/:id     # Remove from wishlist
GET    /api/users/subscriptions    # Get subscriptions
POST   /api/users/subscriptions    # Create subscription
```

#### Kafka Events Consumed
- `user.registered` - Create default profile
- `order.created` - Update purchase history

---

### 7. Vendor Service

**Port**: 4006  
**Database**: `vendor_db` (MongoDB)  
**Purpose**: Vendor management

#### Key Features
- ✅ Vendor registration & onboarding
- ✅ Product management
- ✅ Analytics dashboard
- ✅ Earnings tracking
- ✅ Payout requests

#### Vendor Model
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

#### API Endpoints
```
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

---

### 8. Content Service

**Port**: 4008  
**Database**: `content_db` (MongoDB)  
**Purpose**: Content management (Blog, Help, Jobs)

#### Key Features
- ✅ Blog post management
- ✅ Help articles
- ✅ Tutorial system
- ✅ Job listings
- ✅ SEO optimization

#### API Endpoints
```
GET    /api/content/blog             # List blog posts
GET    /api/content/blog/:slug       # Get blog post
POST   /api/content/blog             # Create post (admin)
PUT    /api/content/blog/:id         # Update post (admin)
DELETE /api/content/blog/:id         # Delete post (admin)
GET    /api/content/help             # List help articles
GET    /api/content/help/:slug       # Get help article
GET    /api/content/jobs             # List jobs
POST   /api/content/jobs/:id/apply   # Apply for job
```

---

### 9. Admin Service

**Port**: 4007  
**Database**: `admin_db` (MongoDB)  
**Purpose**: Platform administration

#### Key Features
- ✅ User management
- ✅ Vendor approval system
- ✅ Product moderation
- ✅ Platform analytics
- ✅ System settings

#### API Endpoints
```
GET    /api/admin/dashboard          # Dashboard stats
GET    /api/admin/users              # List users
GET    /api/admin/users/:id          # Get user
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

### Shared Configuration (`shared/config/`)

1. **db.ts** - MongoDB Connection Manager
2. **redis.ts** - Redis Client Manager
3. **kafka.ts** - Kafka Producer/Consumer
4. **logger.ts** - Winston Logger
5. **env.ts** - Environment Variables

### Shared Middleware (`shared/middleware/`)

1. **auth.middleware.ts** - JWT Authentication
2. **error.middleware.ts** - Error Handling
3. **rateLimit.middleware.ts** - Rate Limiting
4. **validation.middleware.ts** - Input Validation

---

## 📊 Service Communication

### Synchronous (HTTP via API Gateway)
```
Client → API Gateway → Service
```

### Asynchronous (Kafka Events)
```
Service A → Kafka → Service B
```

---

## 📚 Related Documentation

- [Technical Architecture](./technical-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [API Architecture](./api-architecture.md)
- [Setup Guide](./SETUP.md)
- [API Reference](./API_REFERENCE.md)

---

<div align="center">

**[⬆ Back to Top](#backend-services---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>
