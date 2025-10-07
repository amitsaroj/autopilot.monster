# API Architecture - Autopilot Monster

## 🏗️ Microservices API Overview

Autopilot Monster uses a modern microservices architecture built with Node.js and Fastify. The API Gateway serves as the single entry point, routing requests to 8 specialized microservices.

## 🔗 Service Architecture

```
Client (Frontend)
     ↓
API Gateway (Port 4000)
     ↓
┌────────────────────────────────────────┐
│   Microservices Layer                  │
│   • Auth Service (4002)                │
│   • Marketplace Service (4003)         │
│   • Order Service (4004)               │
│   • User Service (4005)                │
│   • Vendor Service (4006)              │
│   • Admin Service (4007)               │
│   • Content Service (4008)             │
│   • Cart Service (4009)                │
└────────────────────────────────────────┘
```

## 🔐 Authentication & Authorization

### JWT Token Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "iat": 1696704000,
  "exp": 1696707600
}
```

### Token Types

| Type | Lifetime | Storage | Purpose |
|------|----------|---------|---------|
| **Access Token** | 1 hour | Memory/localStorage | API authentication |
| **Refresh Token** | 7 days | httpOnly cookie | Token renewal |

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  USER = 'user',      // Standard marketplace user
  VENDOR = 'vendor',  // Product seller
  ADMIN = 'admin'     // Platform administrator
}
```

**Permissions Matrix**:

| Role | Marketplace | Cart | Orders | Vendor | Admin |
|------|------------|------|--------|--------|-------|
| **User** | ✅ View/Review | ✅ Full | ✅ Own | ❌ | ❌ |
| **Vendor** | ✅ + Create | ✅ Full | ✅ Own | ✅ Full | ❌ |
| **Admin** | ✅ Full | ✅ View All | ✅ View All | ✅ Manage | ✅ Full |

## 📡 API Endpoints by Service

### 1. Auth Service (Port 4002)

**Base Path**: `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | User login |
| POST | `/logout` | ✅ | Logout user |
| POST | `/refresh` | ✅ | Refresh access token |
| POST | `/forgot-password` | ❌ | Request password reset |
| POST | `/reset-password` | ❌ | Reset password with token |
| GET | `/verify/:token` | ❌ | Verify email |
| GET | `/profile` | ✅ | Get current user |

**Example Request**:
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. Marketplace Service (Port 4003)

**Base Path**: `/api/marketplace`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | ❌ | List products (paginated) |
| GET | `/products/:id` | ❌ | Get product details |
| POST | `/products` | ✅ Vendor | Create product |
| PUT | `/products/:id` | ✅ Vendor | Update product |
| DELETE | `/products/:id` | ✅ Vendor | Delete product |
| GET | `/categories` | ❌ | List categories |
| GET | `/products/:id/reviews` | ❌ | Get product reviews |
| POST | `/products/:id/reviews` | ✅ | Add review |
| GET | `/search` | ❌ | Search products |
| GET | `/featured` | ❌ | Featured products |
| GET | `/popular` | ❌ | Popular products |

**Example Request**:
```bash
# Get products with filters
curl -X GET "http://localhost:4000/api/marketplace/products?category=ai-agents&minPrice=10&maxPrice=100&page=1&limit=20"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "AI Sales Assistant",
        "description": "Automated sales assistant powered by GPT-4",
        "price": 49.99,
        "category": "ai-agents",
        "rating": 4.8,
        "reviewCount": 127,
        "thumbnail": "https://cdn.example.com/image.jpg",
        "vendorId": "507f1f77bcf86cd799439012",
        "vendorName": "Tech Solutions Inc."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### 3. Cart Service (Port 4009)

**Base Path**: `/api/cart`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | Get user's cart |
| POST | `/items` | ✅ | Add item to cart |
| PUT | `/items/:id` | ✅ | Update cart item |
| DELETE | `/items/:id` | ✅ | Remove cart item |
| DELETE | `/` | ✅ | Clear cart |

**Example Request**:
```bash
# Add to cart
curl -X POST http://localhost:4000/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439011",
    "quantity": 1
  }'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "cartId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "productName": "AI Sales Assistant",
        "price": 49.99,
        "quantity": 1,
        "thumbnail": "https://cdn.example.com/image.jpg"
      }
    ],
    "subtotal": 49.99,
    "tax": 4.50,
    "total": 54.49,
    "currency": "USD"
  }
}
```

---

### 4. Order Service (Port 4004)

**Base Path**: `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create order |
| GET | `/` | ✅ | List user orders |
| GET | `/:id` | ✅ | Get order details |
| POST | `/:id/payment` | ✅ | Process payment |
| POST | `/:id/cancel` | ✅ | Cancel order |
| GET | `/payment-methods` | ✅ | Get payment methods |
| POST | `/webhooks/stripe` | ❌ | Stripe webhook |
| POST | `/webhooks/razorpay` | ❌ | Razorpay webhook |

**Example Request**:
```bash
# Create order
curl -X POST http://localhost:4000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 1,
        "price": 49.99
      }
    ],
    "paymentMethod": "stripe",
    "billingAddress": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St",
      "city": "New York",
      "country": "US",
      "zip": "10001"
    }
  }'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-2024-00001",
    "status": "pending",
    "total": 54.49,
    "paymentIntent": "pi_1234567890",
    "clientSecret": "pi_1234567890_secret_abcdef"
  }
}
```

---

### 5. User Service (Port 4005)

**Base Path**: `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | ✅ | Get user profile |
| PUT | `/profile` | ✅ | Update profile |
| GET | `/dashboard` | ✅ | Dashboard data |
| GET | `/wishlist` | ✅ | Get wishlist |
| POST | `/wishlist` | ✅ | Add to wishlist |
| DELETE | `/wishlist/:id` | ✅ | Remove from wishlist |
| GET | `/subscriptions` | ✅ | Get subscriptions |
| POST | `/subscriptions` | ✅ | Create subscription |
| GET | `/purchases` | ✅ | Purchase history |

**Example Request**:
```bash
# Update profile
curl -X PUT http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "bio": "Software developer and AI enthusiast"
  }'
```

---

### 6. Vendor Service (Port 4006)

**Base Path**: `/api/vendors`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | ✅ Vendor | Get vendor profile |
| PUT | `/profile` | ✅ Vendor | Update profile |
| GET | `/products` | ✅ Vendor | List vendor products |
| POST | `/products` | ✅ Vendor | Create product |
| PUT | `/products/:id` | ✅ Vendor | Update product |
| DELETE | `/products/:id` | ✅ Vendor | Delete product |
| GET | `/analytics` | ✅ Vendor | Get analytics |
| GET | `/earnings` | ✅ Vendor | Get earnings |
| POST | `/payouts` | ✅ Vendor | Request payout |

**Example Response** (Analytics):
```json
{
  "success": true,
  "data": {
    "totalRevenue": 12450.00,
    "totalSales": 247,
    "activeProducts": 15,
    "averageRating": 4.7,
    "monthlyRevenue": [
      { "month": "Jan", "revenue": 1200 },
      { "month": "Feb", "revenue": 1500 },
      { "month": "Mar", "revenue": 1800 }
    ]
  }
}
```

---

### 7. Admin Service (Port 4007)

**Base Path**: `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | ✅ Admin | Dashboard stats |
| GET | `/users` | ✅ Admin | List users |
| GET | `/users/:id` | ✅ Admin | Get user details |
| PUT | `/users/:id` | ✅ Admin | Update user |
| DELETE | `/users/:id` | ✅ Admin | Delete user |
| GET | `/vendors` | ✅ Admin | List vendors |
| POST | `/vendors/:id/approve` | ✅ Admin | Approve vendor |
| POST | `/vendors/:id/reject` | ✅ Admin | Reject vendor |
| GET | `/products` | ✅ Admin | List products |
| POST | `/products/:id/approve` | ✅ Admin | Approve product |
| POST | `/products/:id/reject` | ✅ Admin | Reject product |
| GET | `/analytics` | ✅ Admin | Platform analytics |

---

### 8. Content Service (Port 4008)

**Base Path**: `/api/content`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/blog` | ❌ | List blog posts |
| GET | `/blog/:slug` | ❌ | Get blog post |
| POST | `/blog` | ✅ Admin | Create blog post |
| PUT | `/blog/:id` | ✅ Admin | Update blog post |
| DELETE | `/blog/:id` | ✅ Admin | Delete blog post |
| GET | `/help` | ❌ | List help articles |
| GET | `/help/:slug` | ❌ | Get help article |
| GET | `/jobs` | ❌ | List job openings |
| POST | `/jobs/:id/apply` | ✅ | Apply for job |

---

## 🔄 Event-Driven Architecture

### Kafka Topics

| Topic | Producers | Consumers | Purpose |
|-------|-----------|-----------|---------|
| `user.registered` | Auth Service | User Service, Email Service | New user signup |
| `user.logged-in` | Auth Service | Analytics Service | Login tracking |
| `order.created` | Order Service | Vendor, Email, License Services | New order |
| `payment.success` | Order Service | Vendor, License, Email Services | Payment completed |
| `payment.failed` | Order Service | Email Service | Payment failed |
| `product.created` | Marketplace Service | Search, Analytics Services | New product |
| `vendor.approved` | Admin Service | Vendor, Email Services | Vendor activated |
| `vendor.payout` | Vendor Service | Finance, Email Services | Payout request |

**Event Example**:
```json
{
  "topic": "order.created",
  "payload": {
    "orderId": "ORD-2024-00001",
    "userId": "507f1f77bcf86cd799439011",
    "total": 54.49,
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "vendorId": "507f1f77bcf86cd799439013",
        "price": 49.99
      }
    ],
    "timestamp": "2024-10-07T12:00:00Z"
  }
}
```

## 🗄️ Database Architecture

### MongoDB - Database per Service

```
MongoDB Server (Port 27017)
├── auth_db          # User authentication
├── user_db          # User profiles
├── marketplace_db   # Products & categories
├── cart_db          # Shopping carts
├── order_db         # Orders & payments
├── vendor_db        # Vendor data
├── content_db       # Blog & help content
└── admin_db         # Admin operations
```

### Key Collections

**Products Collection** (`marketplace_db`):
```javascript
{
  _id: ObjectId,
  vendorId: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  tags: [String],
  images: [String],
  rating: Number,
  reviewCount: Number,
  status: String,  // 'active', 'pending', 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

**Orders Collection** (`order_db`):
```javascript
{
  _id: ObjectId,
  orderId: String,
  userId: String,
  items: [{
    productId: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: String,  // 'pending', 'completed', 'cancelled'
  paymentStatus: String,
  paymentIntent: String,
  createdAt: Date
}
```

## 🔍 Search & Caching

### Redis Caching Strategy

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `products:*` | 5 min | Product listings |
| `categories` | 1 hour | Category list |
| `user:*:session` | 7 days | User sessions |
| `rate-limit:*` | 15 min | Rate limiting |
| `search:*` | 10 min | Search results |

### Elasticsearch Indexing

**Products Index**:
```json
{
  "mappings": {
    "properties": {
      "name": { "type": "text", "analyzer": "standard" },
      "description": { "type": "text", "analyzer": "standard" },
      "category": { "type": "keyword" },
      "price": { "type": "float" },
      "rating": { "type": "float" },
      "tags": { "type": "keyword" }
    }
  }
}
```

## 🚀 Performance & Scalability

### Rate Limiting

```typescript
// Global rate limit
rateLimit: {
  max: 100,           // Max requests
  timeWindow: '15m'   // Per 15 minutes
}

// Endpoint-specific
'/api/auth/login': {
  max: 5,
  timeWindow: '15m'
}
```

### Response Times (Target)

| Endpoint Type | Target | Actual |
|--------------|--------|--------|
| **Product Listing** | < 200ms | ~150ms |
| **Product Details** | < 100ms | ~80ms |
| **Cart Operations** | < 50ms | ~30ms |
| **Order Creation** | < 300ms | ~250ms |
| **Search** | < 500ms | ~400ms |

### Caching Headers

```http
Cache-Control: public, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

## 🔒 Security Measures

### API Security

✅ **JWT Authentication** with access & refresh tokens  
✅ **HTTPS Only** (TLS 1.3)  
✅ **CORS** - Configured allowed origins  
✅ **Rate Limiting** - Redis-backed  
✅ **Input Validation** - All endpoints  
✅ **SQL Injection Prevention** - MongoDB ODM  
✅ **XSS Protection** - Content Security Policy  
✅ **CSRF Protection** - Token-based  

### Payment Security

- **PCI DSS Compliant** via Stripe/Razorpay
- **No card storage** on our servers
- **Webhook signature verification**
- **Idempotency keys** for payments

## 📊 API Monitoring

### Health Checks

```bash
# API Gateway
curl http://localhost:4000/health

# Individual service
curl http://localhost:4002/health
```

**Response**:
```json
{
  "status": "healthy",
  "service": "auth-service",
  "version": "1.0.0",
  "uptime": 12345,
  "dependencies": {
    "database": "connected",
    "redis": "connected",
    "kafka": "connected"
  }
}
```

### Swagger Documentation

Access interactive API docs at:
- **API Gateway**: http://localhost:4000/api-docs
- **Individual Services**: http://localhost:4002/api-docs

## 📚 Related Documentation

- [Technical Architecture](./technical-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [Backend Services](./backend-services.md)
- [API Reference](./API_REFERENCE.md)
- [Setup Guide](./SETUP.md)

---

<div align="center">

**[⬆ Back to Top](#api-architecture---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>
