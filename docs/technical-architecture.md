# Technical Architecture - Autopilot Monster

## 🏗️ System Overview

Autopilot Monster is a production-ready, scalable marketplace platform built with modern microservices architecture using Node.js and Fastify. The system enables vendors to sell AI agents, n8n workflows, and automation tools with enterprise-grade security, performance, and user experience.

## 🎯 Core Requirements

### Business Requirements

- **Multi-vendor marketplace** for AI agents and automation tools
- **Free and paid downloads** with secure licensing
- **N8N workflow integration** with preview capabilities
- **Real-time analytics** and vendor dashboards
- **Subscription and one-time payment** models
- **Enterprise-grade security** and compliance

### Technical Requirements

- **99.9% uptime** with horizontal scalability
- **Sub-200ms API response times** for core operations
- **70,000+ requests/second** capability with Fastify
- **Event-driven architecture** with Apache Kafka
- **Real-time notifications** and updates
- **Comprehensive monitoring** and observability
- **Automated testing** and CI/CD pipeline support

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Layer                                 │
│                ┌────────────────────┐                            │
│                │   Next.js 15       │                            │
│                │   Frontend App     │                            │
│                │   (Port 3000)      │                            │
│                └──────────┬─────────┘                            │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateway Layer                               │
│           ┌─────────────────────────────┐                        │
│           │   Fastify API Gateway       │                        │
│           │   (Port 4000)               │                        │
│           │   • Request Routing         │                        │
│           │   • Load Balancing          │                        │
│           │   • Rate Limiting           │                        │
│           │   • Unified Swagger Docs    │                        │
│           │   • Health Aggregation      │                        │
│           └──────────┬──────────────────┘                        │
└──────────────────────┼───────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │               │
        ▼              ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│               Microservices Layer (Node.js/Fastify)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth Service │  │ User Service │  │ Marketplace  │          │
│  │  (Port 4002) │  │ (Port 4005)  │  │   Service    │          │
│  │              │  │              │  │ (Port 4003)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Cart Service │  │Order Service │  │Vendor Service│          │
│  │ (Port 4009)  │  │ (Port 4004)  │  │ (Port 4006)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │Content Svc   │  │Admin Service │                             │
│  │ (Port 4008)  │  │ (Port 4007)  │                             │
│  └──────────────┘  └──────────────┘                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Event Streaming Layer                               │
│                ┌────────────────────┐                            │
│                │  Apache Kafka      │                            │
│                │  (Port 9092)       │                            │
│                │  • Event Bus       │                            │
│                │  • Async Messaging │                            │
│                │  • Service Decouple│                            │
│                └──────────┬─────────┘                            │
└───────────────────────────┼──────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                Data & Cache Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  MongoDB 7.0 │  │  Redis 7.2   │  │Elasticsearch │          │
│  │(Port 27017)  │  │ (Port 6379)  │  │ (Port 9200)  │          │
│  │              │  │              │  │              │          │
│  │• auth_db     │  │• Caching     │  │• Search      │          │
│  │• user_db     │  │• Sessions    │  │• Analytics   │          │
│  │• marketplace │  │• Rate Limit  │  │• Indexing    │          │
│  │• cart_db     │  │• Pub/Sub     │  │              │          │
│  │• order_db    │  └──────────────┘  └──────────────┘          │
│  │• vendor_db   │                                                │
│  │• content_db  │                                                │
│  │• admin_db    │                                                │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.5+ | React framework with App Router |
| **React** | 19.1+ | UI library |
| **TypeScript** | 5+ | Type safety |
| **SCSS/Sass** | 1.92+ | Styling with CSS modules |
| **Framer Motion** | 12+ | Animations and transitions |
| **React Hook Form** | 7.62+ | Form handling |
| **Zod** | 4.1+ | Schema validation |
| **Axios** | 1.12+ | HTTP client |
| **Recharts** | 3.1+ | Data visualization |
| **Lucide React** | 0.542+ | Icon library |

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Fastify** | 4.26+ | Web framework (70k req/s) |
| **TypeScript** | 5.3+ | Type-safe development |
| **MongoDB** | 7.0+ | NoSQL database |
| **Mongoose** | 8.1+ | MongoDB ODM |
| **Redis** | 7.2+ | Caching & sessions |
| **Apache Kafka** | 7.4+ | Event streaming |
| **KafkaJS** | 2.2+ | Kafka client |
| **IORedis** | 5.3+ | Redis client |
| **Winston** | 3.11+ | Logging |
| **bcryptjs** | 2.4+ | Password hashing |
| **jsonwebtoken** | 9.0+ | JWT authentication |

### Infrastructure Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Docker** | Latest | Containerization |
| **Docker Compose** | 3.8+ | Multi-container orchestration |
| **Nginx** | Alpine | Reverse proxy & load balancer |
| **Elasticsearch** | 8.11+ | Search engine |
| **Zookeeper** | 7.4+ | Kafka coordination |
| **Prometheus** | Latest | Metrics collection |
| **Grafana** | Latest | Monitoring dashboards |

## 📊 System Architecture Patterns

### 1. Microservices Architecture

Each service is:
- **Independent**: Own database, deployment, scaling
- **Focused**: Single responsibility principle
- **Resilient**: Isolated failures
- **Scalable**: Horizontal scaling per service

### 2. Database per Service Pattern

```
Auth Service     → auth_db (MongoDB)
User Service     → user_db (MongoDB)
Marketplace Svc  → marketplace_db (MongoDB)
Cart Service     → cart_db (MongoDB)
Order Service    → order_db (MongoDB)
Vendor Service   → vendor_db (MongoDB)
Content Service  → content_db (MongoDB)
Admin Service    → admin_db (MongoDB)
```

**Benefits**:
- Data isolation and independence
- Technology flexibility per service
- Easier scaling and maintenance
- Clear boundaries and ownership

### 3. Event-Driven Architecture

**Kafka Topics**:
```
user.registered     → User signup events
user.logged-in      → Login tracking
order.created       → New orders
payment.success     → Payment confirmations
payment.failed      → Payment failures
product.created     → New products
vendor.approved     → Vendor activations
vendor.payout       → Payout requests
```

**Event Flow Example**:
```
1. Order Service creates order
2. Publishes "order.created" to Kafka
3. Multiple consumers process:
   - Vendor Service → Notifies vendor
   - Email Service → Sends confirmation
   - Analytics Service → Updates metrics
   - License Service → Generates license
```

### 4. API Gateway Pattern

The API Gateway provides:
- **Unified Entry Point**: Single endpoint for all services
- **Request Routing**: Routes to appropriate microservice
- **Load Balancing**: Distributes traffic
- **Rate Limiting**: Protects services
- **Authentication**: JWT validation
- **API Documentation**: Aggregated Swagger

**Routing**:
```
/api/auth/*         → Auth Service (4002)
/api/users/*        → User Service (4005)
/api/marketplace/*  → Marketplace Service (4003)
/api/cart/*         → Cart Service (4009)
/api/orders/*       → Order Service (4004)
/api/vendors/*      → Vendor Service (4006)
/api/content/*      → Content Service (4008)
/api/admin/*        → Admin Service (4007)
```

### 5. CQRS (Command Query Responsibility Segregation)

**Commands** (Write Operations):
- Create, Update, Delete operations
- Validated and processed synchronously
- Publish events to Kafka

**Queries** (Read Operations):
- Read from optimized read models
- Cached with Redis
- Fast response times

### 6. Circuit Breaker Pattern

Prevents cascading failures:
```typescript
// Example: Service call with circuit breaker
if (circuitBreaker.isOpen()) {
  return fallbackResponse;
}

try {
  const response = await serviceCall();
  circuitBreaker.recordSuccess();
  return response;
} catch (error) {
  circuitBreaker.recordFailure();
  throw error;
}
```

## 🔐 Security Architecture

### Authentication & Authorization

**JWT-Based Authentication**:
- **Access Token**: Short-lived (1 hour)
- **Refresh Token**: Long-lived (7 days)
- **Token Storage**: Redis for blacklisting
- **Password Security**: bcrypt with 10 rounds

**Authorization Levels**:
```
1. Public endpoints (no auth)
2. Authenticated users
3. Vendor-only endpoints
4. Admin-only endpoints
```

### Security Layers

```
┌─────────────────────────────────────┐
│    Edge Security (Future)           │
│    • Cloudflare WAF                 │
│    • DDoS Protection                │
│    • SSL/TLS Termination            │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│    Application Security             │
│    • JWT Authentication             │
│    • Rate Limiting (Redis)          │
│    • CORS Configuration             │
│    • Helmet Security Headers        │
│    • Input Validation               │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│    Data Security                    │
│    • MongoDB Authentication         │
│    • Encrypted Connections          │
│    • Database Per Service           │
│    • Backup & Recovery              │
└─────────────────────────────────────┘
```

## 📈 Performance Optimization

### Caching Strategy

**Redis Cache Layers**:

1. **API Response Caching**
   - Product listings: 5 minutes
   - Categories: 1 hour
   - Static content: 24 hours

2. **Session Storage**
   - User sessions
   - JWT blacklist
   - Rate limit counters

3. **Database Query Caching**
   - Frequently accessed data
   - Computed results
   - Aggregation results

### Database Optimization

**MongoDB Indexes**:
```javascript
// Products collection
db.products.createIndex({ vendorId: 1, status: 1 });
db.products.createIndex({ category: 1, price: 1 });
db.products.createIndex({ name: "text", description: "text" });

// Orders collection
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ status: 1, paymentStatus: 1 });

// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
```

**Connection Pooling**:
```typescript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000
});
```

### Load Balancing

**Nginx Configuration**:
```nginx
upstream api_gateway {
  server api-gateway-1:4000;
  server api-gateway-2:4000;
  server api-gateway-3:4000;
}

server {
  listen 80;
  location /api {
    proxy_pass http://api_gateway;
  }
}
```

## 🔄 Data Flow Patterns

### 1. User Registration Flow

```
Client → API Gateway → Auth Service
                          ↓
                     Create User
                          ↓
                    Publish Event → Kafka (user.registered)
                          ↓
              ┌───────────┴───────────┐
              ▼                       ▼
        User Service            Email Service
     (Create Profile)         (Send Welcome)
```

### 2. Product Purchase Flow

```
Client → API Gateway → Order Service
                          ↓
                    Create Order
                          ↓
                  Payment Service
                          ↓
                    Stripe/Razorpay
                          ↓
                    Update Order
                          ↓
                Publish Events → Kafka
                          ↓
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                  ▼
   Vendor Svc      Email Service      License Svc
   (Notify)        (Confirmation)      (Generate)
```

### 3. Search Flow with Elasticsearch

```
Client → API Gateway → Marketplace Service
                          ↓
                    Check Redis Cache
                          ↓
                    Cache Miss?
                          ↓
                   Query Elasticsearch
                          ↓
                    Store in Redis
                          ↓
                    Return Results
```

## 🔍 Monitoring & Observability

### Health Checks

**Endpoint**: `/health` on each service

**Response**:
```json
{
  "status": "healthy",
  "service": "auth-service",
  "version": "1.0.0",
  "uptime": 12345,
  "database": "connected",
  "redis": "connected",
  "kafka": "connected"
}
```

### Logging Strategy

**Winston Configuration**:
```typescript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});
```

**Log Levels**:
- **error**: Critical failures
- **warn**: Warning conditions
- **info**: General information
- **debug**: Detailed debug information

### Metrics Collection

**Prometheus Metrics**:
- Request rate
- Response time
- Error rate
- Database connections
- Cache hit rate
- Queue depth

## 🚀 Scalability Strategy

### Horizontal Scaling

Each service can scale independently:
```bash
# Scale auth service to 3 instances
docker-compose up -d --scale auth-service=3

# Scale marketplace service to 5 instances
docker-compose up -d --scale marketplace-service=5
```

### Database Scaling

**Read Replicas**:
```javascript
mongoose.connect(primaryUri);
mongoose.connection.useReadPrefs('secondary');
```

**Sharding** (Future):
- Shard by user ID
- Shard by geographic region
- Shard by product category

### Caching Scaling

**Redis Cluster**:
- Multiple Redis nodes
- Data replication
- Automatic failover
- High availability

## 🏗️ Future Enhancements

### Planned Improvements

1. **Kubernetes Deployment**
   - Auto-scaling pods
   - Service mesh (Istio)
   - Rolling updates
   - Blue-green deployments

2. **Advanced Monitoring**
   - Distributed tracing (Jaeger)
   - APM tools (New Relic/DataDog)
   - Custom dashboards
   - Alert management

3. **Enhanced Security**
   - OAuth 2.0 integration
   - Two-factor authentication
   - API key management
   - Security audits

4. **Performance Optimization**
   - GraphQL gateway
   - CDN integration
   - Edge computing
   - Database sharding

5. **Additional Features**
   - WebSocket real-time updates
   - AI-powered recommendations
   - Advanced analytics
   - Mobile applications

## 📚 Related Documentation

- [Backend Architecture](./backend-architecture.md) - Detailed backend service structure
- [Backend Services](./backend-services.md) - Individual service documentation
- [API Architecture](./api-architecture.md) - API design and patterns
- [Deployment Guide](./deployment-guide.md) - Production deployment instructions
- [Setup Guide](./SETUP.md) - Development environment setup
- [API Reference](./API_REFERENCE.md) - Complete API documentation

---

<div align="center">

**[⬆ Back to Top](#technical-architecture---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>
