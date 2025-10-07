# 📚 API Reference Guide - Autopilot Monster

Complete API reference for all microservices in the Autopilot Monster platform.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Auth Service API](#auth-service-api)
4. [User Service API](#user-service-api)
5. [Marketplace Service API](#marketplace-service-api)
6. [Cart Service API](#cart-service-api)
7. [Order Service API](#order-service-api)
8. [Vendor Service API](#vendor-service-api)
9. [Content Service API](#content-service-api)
10. [Admin Service API](#admin-service-api)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)
13. [Best Practices](#best-practices)

---

## 🎯 Overview

### Base URL

All API requests should be made to:

```
http://localhost:4000/api
```

**Production**: Replace with your production domain.

### API Gateway Structure

```
/api/auth/*          → Auth Service (4002)
/api/users/*         → User Service (4005)
/api/marketplace/*   → Marketplace Service (4003)
/api/cart/*          → Cart Service (4009)
/api/orders/*        → Order Service (4004)
/api/vendors/*       → Vendor Service (4006)
/api/content/*       → Content Service (4008)
/api/admin/*         → Admin Service (4007)
```

### Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful" // optional
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔐 Authentication

### JWT Token Authentication

Most endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Obtaining Tokens

1. Register or login to receive access and refresh tokens
2. Include the access token in subsequent requests
3. Use the refresh token to get a new access token when it expires

### Token Lifespan

- **Access Token**: 1 hour
- **Refresh Token**: 7 days

---

## 🔑 Auth Service API

**Base Path**: `/api/auth`

### Register User

Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "user_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Validations**:
- Email must be valid and unique
- Password minimum 8 characters
- First name and last name required

### Login

Authenticate and receive JWT tokens.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "user_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Refresh Token

Get a new access token using refresh token.

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout

Invalidate tokens (requires authentication).

```http
POST /api/auth/logout
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Forgot Password

Request password reset email.

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Reset Password

Reset password using token from email.

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👤 User Service API

**Base Path**: `/api/users`  
**Authentication**: Required for all endpoints

### Get User Profile

```http
GET /api/users/profile
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "user_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+1234567890",
    "preferences": {
      "newsletter": true,
      "notifications": true,
      "language": "en",
      "timezone": "UTC",
      "theme": "light"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update User Profile

```http
PUT /api/users/profile
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "preferences": {
    "newsletter": false,
    "theme": "dark"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": { /* updated profile */ },
  "message": "Profile updated successfully"
}
```

### Get Dashboard Data

```http
GET /api/users/dashboard
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalPurchases": 5,
    "totalSpent": 499.95,
    "wishlistItems": 12,
    "recentOrders": [
      {
        "orderId": "order_xyz789",
        "total": 99.99,
        "status": "delivered",
        "createdAt": "2024-01-10T10:30:00.000Z"
      }
    ],
    "recommendedProducts": [ /* products */ ]
  }
}
```

### Wishlist Operations

**Get Wishlist:**
```http
GET /api/users/wishlist
Authorization: Bearer <access-token>
```

**Add to Wishlist:**
```http
POST /api/users/wishlist
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "productId": "product_123",
  "productName": "AI Agent Pro",
  "productPrice": 99.99
}
```

**Remove from Wishlist:**
```http
DELETE /api/users/wishlist/<productId>
Authorization: Bearer <access-token>
```

---

## 🛍️ Marketplace Service API

**Base Path**: `/api/marketplace`

### Get All Products

```http
GET /api/marketplace/products?page=1&limit=20&category=ai-agents&sortBy=popular
```

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `category` (string, optional): Filter by category
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price
- `minRating` (number, optional): Minimum rating
- `search` (string, optional): Search query
- `sortBy` (string, optional): `popular`, `newest`, `price_asc`, `price_desc`, `rating`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "product_123",
        "name": "AI Agent Pro",
        "description": "Advanced AI automation agent",
        "price": 99.99,
        "originalPrice": 149.99,
        "currency": "USD",
        "category": "ai-agents",
        "tags": ["ai", "automation", "productivity"],
        "vendorId": "vendor_abc",
        "vendorName": "TechFlow Solutions",
        "images": ["url1", "url2"],
        "thumbnail": "thumbnail-url",
        "rating": 4.8,
        "reviewCount": 234,
        "downloadCount": 1250,
        "isFeatured": true,
        "isPopular": true
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

### Get Product Details

```http
GET /api/marketplace/products/<productId>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "productId": "product_123",
    "name": "AI Agent Pro",
    "description": "Detailed product description...",
    "longDescription": "Full detailed description with features...",
    "price": 99.99,
    "features": [
      "Feature 1",
      "Feature 2",
      "Feature 3"
    ],
    "requirements": {
      "minimum": "Requirements...",
      "recommended": "Recommended specs..."
    },
    "reviews": [ /* recent reviews */ ],
    /* ... other product details */
  }
}
```

### Search Products

```http
GET /api/marketplace/products/search?q=automation&category=workflows
```

### Get Categories

```http
GET /api/marketplace/categories
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "categoryId": "cat_ai-agents",
      "name": "AI Agents",
      "slug": "ai-agents",
      "description": "Intelligent AI-powered agents",
      "icon": "icon-url",
      "productCount": 1250
    },
    {
      "categoryId": "cat_workflows",
      "name": "N8N Workflows",
      "slug": "workflows",
      "description": "Pre-built automation workflows",
      "productCount": 890
    }
  ]
}
```

### Product Reviews

**Get Product Reviews:**
```http
GET /api/marketplace/products/<productId>/reviews?page=1&limit=10
```

**Create Review (requires authentication):**
```http
POST /api/marketplace/products/<productId>/reviews
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "rating": 5,
  "title": "Excellent product!",
  "comment": "This product exceeded my expectations..."
}
```

---

## 🛒 Cart Service API

**Base Path**: `/api/cart`  
**Authentication**: Required

### Get Cart

```http
GET /api/cart
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "cartId": "cart_xyz789",
    "userId": "user_abc123",
    "items": [
      {
        "productId": "product_123",
        "productName": "AI Agent Pro",
        "price": 99.99,
        "quantity": 1,
        "subtotal": 99.99,
        "thumbnail": "image-url"
      }
    ],
    "subtotal": 199.98,
    "tax": 18.00,
    "total": 217.98,
    "currency": "USD",
    "itemCount": 2,
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Add to Cart

```http
POST /api/cart/items
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "productId": "product_123",
  "quantity": 1
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": { /* updated cart */ },
  "message": "Item added to cart"
}
```

### Update Cart Item

```http
PUT /api/cart/items/<productId>
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "quantity": 2
}
```

### Remove from Cart

```http
DELETE /api/cart/items/<productId>
Authorization: Bearer <access-token>
```

### Clear Cart

```http
DELETE /api/cart
Authorization: Bearer <access-token>
```

---

## 📦 Order Service API

**Base Path**: `/api/orders`  
**Authentication**: Required

### Create Order

```http
POST /api/orders
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "cartId": "cart_xyz789",
  "paymentMethod": "stripe",
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "country": "US",
    "postalCode": "94105",
    "phone": "+1234567890"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "orderId": "order_xyz789",
    "userId": "user_abc123",
    "items": [ /* order items */ ],
    "subtotal": 199.98,
    "tax": 18.00,
    "total": 217.98,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "stripe",
    "paymentIntent": "pi_stripe_id",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Order created successfully"
}
```

### Get Order

```http
GET /api/orders/<orderId>
Authorization: Bearer <access-token>
```

### Get All Orders

```http
GET /api/orders?page=1&limit=10&status=completed
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "order_xyz789",
        "total": 217.98,
        "status": "delivered",
        "paymentStatus": "paid",
        "itemCount": 2,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

### Process Payment

```http
POST /api/orders/<orderId>/payment
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "paymentMethodId": "pm_stripe_card_id",
  "savePaymentMethod": true
}
```

### Get Payment Methods

```http
GET /api/orders/payment-methods
Authorization: Bearer <access-token>
```

---

## 🏪 Vendor Service API

**Base Path**: `/api/vendors`  
**Authentication**: Required (Vendor role)

### Get Vendor Profile

```http
GET /api/vendors/profile
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "vendorId": "vendor_abc",
    "name": "TechFlow Solutions",
    "email": "vendor@techflow.com",
    "description": "Leading provider of AI automation solutions",
    "verified": true,
    "status": "active",
    "joinDate": "2024-01-01T00:00:00.000Z",
    "productsCount": 12,
    "totalRevenue": 15420.50,
    "averageRating": 4.7
  }
}
```

### Get Vendor Products

```http
GET /api/vendors/products?status=active
Authorization: Bearer <access-token>
```

### Create Product

```http
POST /api/vendors/products
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "New AI Agent",
  "description": "Description of the product",
  "price": 99.99,
  "category": "ai-agents",
  "tags": ["ai", "automation"],
  "images": ["url1", "url2"],
  "features": ["feature1", "feature2"]
}
```

### Update Product

```http
PUT /api/vendors/products/<productId>
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99
}
```

### Delete Product

```http
DELETE /api/vendors/products/<productId>
Authorization: Bearer <access-token>
```

### Get Analytics

```http
GET /api/vendors/analytics
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15420.50,
    "totalDownloads": 1250,
    "totalProducts": 12,
    "averageRating": 4.7,
    "monthlyRevenue": 2450.00,
    "monthlyDownloads": 156,
    "topProducts": [
      {
        "productId": "product_123",
        "name": "AI Agent Pro",
        "revenue": 5000.00,
        "downloads": 500
      }
    ],
    "revenueByMonth": [ /* monthly breakdown */ ]
  }
}
```

### Get Earnings

```http
GET /api/vendors/earnings
Authorization: Bearer <access-token>
```

### Request Payout

```http
POST /api/vendors/payouts
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "amount": 1000.00,
  "paymentMethod": "bank_transfer",
  "accountDetails": {
    "accountNumber": "1234567890",
    "routingNumber": "123456789",
    "accountName": "TechFlow Solutions"
  }
}
```

---

## 📝 Content Service API

**Base Path**: `/api/content`

### Blog Posts

**Get All Posts:**
```http
GET /api/content/blog?page=1&limit=10&category=tutorials
```

**Get Single Post:**
```http
GET /api/content/blog/<slug>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "postId": "post_123",
    "title": "How to Build AI Agents",
    "slug": "how-to-build-ai-agents",
    "excerpt": "Learn how to build powerful AI agents...",
    "content": "Full article content...",
    "author": {
      "id": "author_123",
      "name": "John Doe",
      "avatar": "avatar-url"
    },
    "category": "tutorials",
    "tags": ["ai", "automation", "tutorial"],
    "featuredImage": "image-url",
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "readTime": 8,
    "views": 1250
  }
}
```

**Create Post (Admin only):**
```http
POST /api/content/blog
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Full content...",
  "category": "tutorials",
  "tags": ["ai", "automation"],
  "featuredImage": "image-url"
}
```

### Help Articles

**Get All Articles:**
```http
GET /api/content/help?category=getting-started
```

**Get Article:**
```http
GET /api/content/help/<slug>
```

### Job Listings

**Get All Jobs:**
```http
GET /api/content/jobs?department=engineering&location=remote
```

**Get Job Details:**
```http
GET /api/content/jobs/<jobId>
```

**Apply for Job:**
```http
POST /api/content/jobs/<jobId>/apply
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "resume": "resume-url",
  "coverLetter": "Cover letter text..."
}
```

---

## 👨‍💼 Admin Service API

**Base Path**: `/api/admin`  
**Authentication**: Required (Admin role)

### Dashboard Stats

```http
GET /api/admin/dashboard
Authorization: Bearer <access-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 15420,
      "totalVendors": 342,
      "totalProducts": 1250,
      "totalRevenue": 154200.50,
      "monthlyActiveUsers": 8500
    },
    "recentActivity": [
      {
        "id": "activity_123",
        "type": "user",
        "action": "registered",
        "description": "New user registered",
        "timestamp": "2024-01-15T10:30:00.000Z"
      }
    ],
    "systemHealth": {
      "status": "operational",
      "uptime": 99.99,
      "responseTime": 45,
      "errorRate": 0.01
    }
  }
}
```

### User Management

**Get All Users:**
```http
GET /api/admin/users?page=1&limit=20&search=john&status=active
Authorization: Bearer <access-token>
```

**Get User:**
```http
GET /api/admin/users/<userId>
Authorization: Bearer <access-token>
```

**Update User:**
```http
PUT /api/admin/users/<userId>
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "status": "suspended",
  "role": "vendor"
}
```

**Delete User:**
```http
DELETE /api/admin/users/<userId>
Authorization: Bearer <access-token>
```

### Vendor Management

**Get All Vendors:**
```http
GET /api/admin/vendors?status=pending
Authorization: Bearer <access-token>
```

**Approve Vendor:**
```http
POST /api/admin/vendors/<vendorId>/approve
Authorization: Bearer <access-token>
```

**Reject Vendor:**
```http
POST /api/admin/vendors/<vendorId>/reject
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "reason": "Incomplete documentation"
}
```

### Product Moderation

**Get All Products:**
```http
GET /api/admin/products?status=pending
Authorization: Bearer <access-token>
```

**Approve Product:**
```http
POST /api/admin/products/<productId>/approve
Authorization: Bearer <access-token>
```

**Reject Product:**
```http
POST /api/admin/products/<productId>/reject
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "reason": "Violates content policy"
}
```

**Delete Product:**
```http
DELETE /api/admin/products/<productId>
Authorization: Bearer <access-token>
```

---

## ❌ Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/endpoint",
  "details": {} // optional, validation errors
}
```

### Common HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Invalid request data |
| **401** | Unauthorized | Missing or invalid authentication |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource already exists |
| **422** | Unprocessable Entity | Validation failed |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server-side error |
| **503** | Service Unavailable | Service temporarily down |

### Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "statusCode": 422,
  "details": {
    "email": ["Email is required", "Email must be valid"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

---

## ⏱️ Rate Limiting

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
```

### Default Limits

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **Admin endpoints**: 5000 requests per 15 minutes per admin

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "statusCode": 429,
  "retryAfter": 300
}
```

---

## ✨ Best Practices

### 1. Always Use HTTPS in Production

```bash
# Development (HTTP)
http://localhost:4000/api/endpoint

# Production (HTTPS)
https://api.autopilot.monster/api/endpoint
```

### 2. Handle Token Expiration

```javascript
// Implement token refresh logic
async function apiCall(endpoint) {
  try {
    return await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  } catch (error) {
    if (error.statusCode === 401) {
      // Refresh token
      await refreshAccessToken();
      // Retry request
      return apiCall(endpoint);
    }
    throw error;
  }
}
```

### 3. Implement Retry Logic

```javascript
async function apiCallWithRetry(endpoint, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(endpoint);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 4. Use Pagination for Large Datasets

```javascript
// Good: Use pagination
GET /api/marketplace/products?page=1&limit=20

// Bad: Request all at once
GET /api/marketplace/products  // Returns thousands of products
```

### 5. Cache Responses When Appropriate

```javascript
// Cache frequently accessed data
const cache = new Map();

async function getProducts() {
  if (cache.has('products')) {
    return cache.get('products');
  }
  const products = await fetch('/api/marketplace/products');
  cache.set('products', products);
  setTimeout(() => cache.delete('products'), 5 * 60 * 1000); // 5 min
  return products;
}
```

### 6. Validate Input Before Sending

```javascript
// Client-side validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (!validateEmail(email)) {
  // Show error, don't make API call
  return;
}
```

### 7. Handle Errors Gracefully

```javascript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    const error = await response.json();
    // Display user-friendly error message
    showError(error.message);
  }
} catch (error) {
  // Network error
  showError('Unable to connect to server');
}
```

### 8. Use Appropriate HTTP Methods

- **GET**: Retrieve data
- **POST**: Create new resource
- **PUT**: Update entire resource
- **PATCH**: Partial update
- **DELETE**: Remove resource

### 9. Include Idempotency Keys for Critical Operations

```http
POST /api/orders
Idempotency-Key: unique-key-12345
Content-Type: application/json

{ /* order data */ }
```

### 10. Monitor API Usage

- Track response times
- Monitor error rates
- Watch for rate limit violations
- Set up alerts for anomalies

---

## 🔍 Testing API Endpoints

### Using cURL

```bash
# Example: Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456"}'
```

### Using Swagger UI

1. Navigate to http://localhost:4000/api-docs
2. Click "Authorize" and enter JWT token
3. Test endpoints interactively

### Using Postman

1. Import OpenAPI spec: http://localhost:4000/api-docs-json
2. Set up environment variables
3. Create test collections

---

## 📊 API Versioning

Currently using **implicit versioning** through the API Gateway.

**Future versions** will use URL-based versioning:

```http
/api/v1/endpoint  # Version 1
/api/v2/endpoint  # Version 2
```

---

## 📞 Support

### Interactive Documentation

**Swagger UI**: http://localhost:4000/api-docs

### Getting Help

1. Check this API reference
2. Review [README.md](../README.md)
3. Check [PROJECT_STATUS.md](../PROJECT_STATUS.md)
4. Open a GitHub issue

---

<div align="center">

**[⬆ Back to Top](#-api-reference-guide---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>

