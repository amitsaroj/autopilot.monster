# Autopilot.Monster - AI Agent Marketplace

A comprehensive multi-service marketplace platform for AI agents, n8n workflows, and automation templates.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (optional - services will work without it in development mode)
- Redis (optional - services will work without it in development mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autopilot.monster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start all services**
   ```bash
   ./start-all-services.sh
   ```

4. **Stop all services**
   ```bash
   ./stop-all-services.sh
   ```

## 📦 Architecture

### Services

| Service | Port | Description | API Docs |
|---------|------|-------------|----------|
| **API Gateway** | 4000 | Main entry point, routes to microservices | http://localhost:4000/api-docs |
| **Auth Service** | 3001 | Authentication & Authorization | http://localhost:3001/api-docs |
| **Catalog Service** | 3002 | Product catalog management | http://localhost:3002/api-docs |
| **Payment Service** | 3003 | Payment processing & orders | http://localhost:3003/api-docs |
| **User Service** | 3004 | User profile management | http://localhost:3004/api-docs |
| **Vendor Service** | 3005 | Vendor dashboard & analytics | http://localhost:3005/api-docs |
| **Frontend** | 3000 | Next.js web application | http://localhost:3000 |

## 🔗 API Endpoints

### API Gateway (Port 4000)

All requests should go through the API Gateway at `http://localhost:4000/api/v1/`

#### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/change-password` - Change password

#### OAuth

- `GET /api/v1/auth/google` - Google OAuth login
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `GET /api/v1/auth/github` - GitHub OAuth login
- `GET /api/v1/auth/github/callback` - GitHub OAuth callback

#### Products/Catalog

- `GET /api/v1/catalog/products` - List all products
- `GET /api/v1/catalog/products/:id` - Get product details
- `POST /api/v1/catalog/products` - Create product (vendor only)
- `PUT /api/v1/catalog/products/:id` - Update product (vendor only)
- `DELETE /api/v1/catalog/products/:id` - Delete product (vendor only)
- `POST /api/v1/catalog/search` - Search products
- `GET /api/v1/catalog/featured` - Get featured products
- `GET /api/v1/catalog/trending` - Get trending products
- `GET /api/v1/catalog/categories` - List categories

#### Shopping Cart

- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:itemId` - Update cart item
- `DELETE /api/v1/cart/items/:itemId` - Remove item from cart
- `DELETE /api/v1/cart` - Clear cart
- `POST /api/v1/cart/coupon` - Apply coupon

#### Checkout & Orders

- `POST /api/v1/checkout/initiate` - Initiate checkout
- `POST /api/v1/checkout/payment-intent` - Create payment intent
- `POST /api/v1/checkout/payment/confirm` - Confirm payment
- `POST /api/v1/checkout/complete` - Complete order
- `GET /api/v1/payment/orders` - List user orders
- `GET /api/v1/payment/orders/:id` - Get order details
- `POST /api/v1/payment/orders/:id/cancel` - Cancel order

#### User Management

- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `GET /api/v1/user/orders` - Get user orders
- `GET /api/v1/user/downloads` - Get user downloads
- `GET /api/v1/user/wishlist` - Get wishlist
- `POST /api/v1/user/wishlist/:productId` - Add to wishlist
- `DELETE /api/v1/user/wishlist/:productId` - Remove from wishlist

#### Vendor Dashboard

- `GET /api/v1/vendor/profile` - Get vendor profile
- `PUT /api/v1/vendor/profile` - Update vendor profile
- `GET /api/v1/vendor/products` - List vendor products
- `POST /api/v1/vendor/products` - Create new product
- `PUT /api/v1/vendor/products/:id` - Update product
- `DELETE /api/v1/vendor/products/:id` - Delete product
- `GET /api/v1/vendor/orders` - List vendor orders
- `GET /api/v1/vendor/analytics` - Get vendor analytics
- `GET /api/v1/vendor/payouts` - Get payout history
- `POST /api/v1/vendor/kyc/submit` - Submit KYC documents

#### Admin Dashboard

- `GET /api/v1/admin/dashboard` - Get admin dashboard data
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/vendors` - List all vendors
- `GET /api/v1/admin/products` - List all products
- `GET /api/v1/admin/orders` - List all orders
- `GET /api/v1/admin/analytics` - Get platform analytics

#### Content Management

- `GET /api/v1/content/blog/posts` - List blog posts
- `GET /api/v1/content/blog/posts/:slug` - Get blog post
- `GET /api/v1/content/help/articles` - List help articles
- `GET /api/v1/content/tutorials` - List tutorials
- `GET /api/v1/content/careers/jobs` - List job openings

## 🛠️ Development

### Project Structure

```
autopilot.monster/
├── services/
│   ├── api-gateway/       # API Gateway (Port 4000)
│   ├── auth-service/      # Auth Service (Port 3001)
│   ├── catalog-service/   # Catalog Service (Port 3002)
│   ├── payment-service/   # Payment Service (Port 3003)
│   ├── user-service/      # User Service (Port 3004)
│   └── vendor-service/    # Vendor Service (Port 3005)
├── frontend/              # Next.js Frontend (Port 3000)
├── shared/                # Shared proto files and types
├── logs/                  # Service logs (generated)
└── scripts/               # Utility scripts
```

### Running Individual Services

Each service can be run independently:

```bash
# API Gateway
cd services/api-gateway && npm run start:dev

# Auth Service
cd services/auth-service && npm run start:dev

# Catalog Service
cd services/catalog-service && npm run start:dev

# Frontend
cd frontend && npm run dev
```

### Logs

Service logs are stored in the `logs/` directory:

- `logs/api-gateway.log`
- `logs/auth-service.log`
- `logs/catalog-service.log`
- `logs/payment-service.log`
- `logs/user-service.log`
- `logs/vendor-service.log`
- `logs/frontend.log`

View logs in real-time:

```bash
tail -f logs/api-gateway.log
tail -f logs/auth-service.log
```

### Testing API Endpoints

You can test the API using:

1. **Swagger UI**: Visit http://localhost:4000/api-docs
2. **cURL**:
   ```bash
   # Health check
   curl http://localhost:4000/api/v1/health
   
   # Register
   curl -X POST http://localhost:4000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
   
   # Login
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Postman**: Import the OpenAPI spec from http://localhost:4000/api-docs/json

## 🔐 Authentication

The platform uses JWT-based authentication:

1. Register or login to get an access token
2. Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your-access-token>
   ```

Example:
```bash
curl http://localhost:4000/api/v1/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🌐 Frontend

The frontend is built with:

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**

### Features

- Server-side rendering (SSR)
- Static site generation (SSG)
- API Routes
- Dynamic routing
- Authentication & Authorization
- Responsive design

## 📊 Features

### For Customers

- Browse AI agents, workflows, and templates
- Advanced search and filtering
- Add items to cart and wishlist
- Secure checkout with multiple payment options
- Download purchased products
- Review and rate products
- Order history and tracking

### For Vendors

- Create and manage products
- Upload files and screenshots
- Set pricing (free, one-time, subscription, tiered)
- View analytics and sales reports
- Manage orders and refunds
- Receive payouts
- KYC verification

### For Admins

- Dashboard with platform-wide analytics
- User management
- Vendor approval and management
- Product moderation
- Order management
- Content management
- System settings

## 🔧 Configuration

Each service can be configured via environment variables. Default values are provided for development.

### Common Environment Variables

```bash
# Database
DATABASE_URL=mongodb://localhost:27017/autopilot-monster

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# OAuth
OAUTH_GOOGLE_CLIENT_ID=your-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-client-secret
OAUTH_GITHUB_CLIENT_ID=your-client-id
OAUTH_GITHUB_CLIENT_SECRET=your-client-secret
```

## 🚨 Troubleshooting

### Services won't start

1. Check if ports are already in use:
   ```bash
   lsof -i :3000,3001,3002,3003,3004,3005,4000
   ```

2. Kill existing processes:
   ```bash
   ./stop-all-services.sh
   ```

3. Check logs:
   ```bash
   tail -f logs/*.log
   ```

### Database connection errors

Services will work without MongoDB/Redis in development mode. External services are optional.

### Port conflicts

Change ports in `start-all-services.sh` or set `PORT` environment variable for each service.

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Contact

[Add contact information here]

---

Made with ❤️ by Autopilot.Monster Team
