# Backend Architecture - Autopilot.monster

## Overview

This document outlines the comprehensive NestJS microservices architecture for the Autopilot.monster marketplace platform.

## Architecture Pattern

### Microservices Structure

```
backend/
├── services/
│   ├── auth-service/           # Authentication & Authorization
│   ├── user-service/           # User Management
│   ├── catalog-service/        # Product Catalog
│   ├── payment-service/        # Payment Processing
│   ├── order-service/          # Order Management
│   ├── download-service/       # Digital Downloads
│   ├── license-service/        # License Management
│   ├── vendor-service/         # Vendor Management
│   ├── admin-service/          # Admin Operations
│   ├── analytics-service/      # Analytics & Reporting
│   ├── notification-service/   # Email/SMS Notifications
│   └── file-service/           # File Upload/Storage
├── shared/
│   ├── common/                 # Shared DTOs, Types
│   ├── database/               # Database Schemas
│   ├── utils/                  # Utility Functions
│   └── config/                 # Configuration
├── gateway/
│   └── api-gateway/            # API Gateway (NestJS)
└── infrastructure/
    ├── docker/                 # Docker Configurations
    ├── kubernetes/             # K8s Manifests
    └── terraform/              # Infrastructure as Code
```

## Service Details

### 1. Auth Service
**Responsibility**: Authentication, JWT tokens, password management

```typescript
// auth-service/src/auth.controller.ts
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // JWT authentication logic
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // User registration logic
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // Password reset logic
  }

  @Post('refresh')
  async refreshToken(@Body() refreshDto: RefreshTokenDto) {
    // Token refresh logic
  }
}
```

**Database**: MongoDB (users, tokens, sessions)
**Message Queue**: NATS for auth events
**Cache**: Redis for session storage

### 2. User Service
**Responsibility**: User profiles, preferences, account management

```typescript
// user-service/src/user.controller.ts
@Controller('users')
export class UserController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    // Get user profile
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() updateDto: UpdateProfileDto) {
    // Update user profile
  }

  @Get('purchases')
  @UseGuards(JwtAuthGuard)
  async getPurchases(@Req() req) {
    // Get user purchase history
  }
}
```

### 3. Catalog Service
**Responsibility**: Product management, search, categories

```typescript
// catalog-service/src/catalog.controller.ts
@Controller('catalog')
export class CatalogController {
  @Get('products')
  async getProducts(@Query() query: ProductSearchDto) {
    // Search and filter products
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    // Get single product details
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, VendorGuard)
  async createProduct(@Body() productDto: CreateProductDto) {
    // Create new product (vendor only)
  }

  @Get('categories')
  async getCategories() {
    // Get product categories
  }
}
```

### 4. Payment Service
**Responsibility**: Stripe/Razorpay integration, payment processing

```typescript
// payment-service/src/payment.controller.ts
@Controller('payments')
export class PaymentController {
  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(@Body() paymentDto: CreatePaymentDto) {
    // Create Stripe payment intent
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  async confirmPayment(@Body() confirmDto: ConfirmPaymentDto) {
    // Confirm payment
  }

  @Post('webhook/stripe')
  async stripeWebhook(@Body() payload: any, @Headers() headers: any) {
    // Handle Stripe webhooks
  }

  @Post('webhook/razorpay')
  async razorpayWebhook(@Body() payload: any, @Headers() headers: any) {
    // Handle Razorpay webhooks
  }
}
```

### 5. Order Service
**Responsibility**: Order management, cart operations

```typescript
// order-service/src/order.controller.ts
@Controller('orders')
export class OrderController {
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() orderDto: CreateOrderDto) {
    // Create new order
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req, @Query() query: OrderQueryDto) {
    // Get user orders
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string) {
    // Get single order
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateOrderStatus(@Param('id') id: string, @Body() statusDto: UpdateStatusDto) {
    // Update order status (admin)
  }
}
```

### 6. Download Service
**Responsibility**: Digital asset delivery, license verification

```typescript
// download-service/src/download.controller.ts
@Controller('downloads')
export class DownloadController {
  @Get(':productId/download')
  @UseGuards(JwtAuthGuard, PurchaseGuard)
  async downloadProduct(@Param('productId') productId: string, @Req() req) {
    // Generate secure download link
  }

  @Get(':productId/license')
  @UseGuards(JwtAuthGuard, PurchaseGuard)
  async getLicenseKey(@Param('productId') productId: string, @Req() req) {
    // Get license key for purchased product
  }

  @Post(':productId/track')
  async trackDownload(@Param('productId') productId: string, @Body() trackDto: TrackDownloadDto) {
    // Track download analytics
  }
}
```

## Database Schema

### MongoDB Collections

```typescript
// User Schema
interface User {
  _id: ObjectId
  email: string
  password: string // hashed
  profile: {
    firstName: string
    lastName: string
    avatar?: string
    company?: string
    phone?: string
  }
  role: 'user' | 'vendor' | 'admin'
  status: 'active' | 'suspended' | 'pending'
  preferences: {
    newsletter: boolean
    notifications: boolean
  }
  createdAt: Date
  updatedAt: Date
}

// Product Schema
interface Product {
  _id: ObjectId
  name: string
  description: string
  type: 'agent' | 'workflow' | 'tool'
  category: string
  tags: string[]
  price: number
  vendor: ObjectId // User ID
  status: 'active' | 'pending' | 'rejected' | 'draft'
  files: {
    thumbnail: string
    screenshots: string[]
    downloadUrl: string
    size: number
  }
  metadata: {
    version: string
    requirements: string[]
    compatibility: string[]
  }
  analytics: {
    downloads: number
    views: number
    rating: number
    reviews: number
  }
  createdAt: Date
  updatedAt: Date
}

// Order Schema
interface Order {
  _id: ObjectId
  orderNumber: string
  user: ObjectId // User ID
  items: Array<{
    product: ObjectId // Product ID
    price: number
    quantity: number
    license: string
  }>
  billing: {
    firstName: string
    lastName: string
    email: string
    address: object
  }
  payment: {
    provider: 'stripe' | 'razorpay'
    paymentId: string
    status: 'pending' | 'completed' | 'failed' | 'refunded'
    amount: number
    currency: string
  }
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  licenses: Array<{
    product: ObjectId
    licenseKey: string
    activatedAt?: Date
    expiresAt?: Date
  }>
  createdAt: Date
  updatedAt: Date
}
```

## Message Queue (NATS)

### Event-Driven Architecture

```typescript
// Events Published
interface Events {
  'user.registered': { userId: string, email: string }
  'user.verified': { userId: string }
  'product.uploaded': { productId: string, vendorId: string }
  'product.approved': { productId: string, vendorId: string }
  'order.created': { orderId: string, userId: string }
  'payment.completed': { orderId: string, paymentId: string }
  'download.started': { productId: string, userId: string }
}

// Event Handlers
@Injectable()
export class UserEventHandler {
  @EventPattern('user.registered')
  async handleUserRegistered(data: { userId: string, email: string }) {
    // Send welcome email
    // Create user analytics profile
  }

  @EventPattern('payment.completed')
  async handlePaymentCompleted(data: { orderId: string, paymentId: string }) {
    // Generate license keys
    // Send purchase confirmation email
    // Update analytics
  }
}
```

## API Gateway

### Route Configuration

```typescript
// api-gateway/src/app.module.ts
@Module({
  imports: [
    ProxyModule.register([
      {
        name: 'auth',
        upstream: 'http://auth-service:3001',
        paths: ['/api/auth/*']
      },
      {
        name: 'users',
        upstream: 'http://user-service:3002',
        paths: ['/api/users/*']
      },
      {
        name: 'catalog',
        upstream: 'http://catalog-service:3003',
        paths: ['/api/catalog/*', '/api/products/*']
      },
      {
        name: 'payments',
        upstream: 'http://payment-service:3004',
        paths: ['/api/payments/*']
      },
      {
        name: 'orders',
        upstream: 'http://order-service:3005',
        paths: ['/api/orders/*']
      }
    ])
  ]
})
export class AppModule {}
```

## Deployment

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  # Databases
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Message Queue
  nats:
    image: nats:2.10-alpine
    ports:
      - "4222:4222"
      - "8222:8222"

  # API Gateway
  api-gateway:
    build: ./gateway/api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - user-service
      - catalog-service

  # Microservices
  auth-service:
    build: ./services/auth-service
    ports:
      - "3001:3001"
    depends_on:
      - mongodb
      - redis
      - nats

  user-service:
    build: ./services/user-service
    ports:
      - "3002:3002"
    depends_on:
      - mongodb
      - nats

  catalog-service:
    build: ./services/catalog-service
    ports:
      - "3003:3003"
    depends_on:
      - mongodb
      - nats
```

### Kubernetes Deployment

```yaml
# k8s/auth-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: autopilot/auth-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: jwt-secret
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
    - protocol: TCP
      port: 3001
      targetPort: 3001
```

## Security

### Authentication & Authorization

- JWT tokens with refresh token rotation
- Role-based access control (RBAC)
- API rate limiting
- Request validation
- CORS protection
- Helmet.js security headers

### Data Protection

- MongoDB encryption at rest
- Redis encryption in transit
- File encryption for sensitive data
- PII data anonymization
- GDPR compliance measures

## Monitoring & Logging

### Application Monitoring

```typescript
// Prometheus metrics
@Injectable()
export class MetricsService {
  private readonly requestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status']
  })

  private readonly responseTime = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['method', 'route']
  })

  recordRequest(method: string, route: string, status: number) {
    this.requestCounter.inc({ method, route, status })
  }

  recordResponseTime(method: string, route: string, duration: number) {
    this.responseTime.observe({ method, route }, duration)
  }
}
```

### Logging Strategy

- Structured logging with Winston
- Centralized log aggregation (ELK Stack)
- Request/response logging
- Error tracking with Sentry
- Performance monitoring with APM

## Development Setup

### Prerequisites

```bash
# Install dependencies
npm install -g @nestjs/cli
npm install -g typescript

# Start infrastructure
docker-compose up -d mongodb redis nats

# Install service dependencies
cd services/auth-service && npm install
cd services/user-service && npm install
# ... repeat for all services
```

### Running Services

```bash
# Start all services in development
npm run start:dev:all

# Or start individual services
npm run start:dev auth-service
npm run start:dev user-service
```

## Testing Strategy

### Unit Tests
- Jest for unit testing
- 80%+ code coverage requirement
- Mocked dependencies

### Integration Tests
- Supertest for API testing
- Test database isolation
- Service-to-service communication tests

### E2E Tests
- Cypress for frontend E2E
- API E2E with real database
- Load testing with Artillery

## Performance Optimization

### Caching Strategy
- Redis for session storage
- MongoDB query result caching
- CDN for static assets
- GraphQL query caching

### Database Optimization
- MongoDB indexing strategy
- Connection pooling
- Read replicas for analytics
- Aggregation pipeline optimization

This backend architecture provides a scalable, maintainable, and secure foundation for the Autopilot.monster marketplace platform.
