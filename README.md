# Autopilot.Monster - Enterprise AI Automation Platform

## 🚀 Overview

Autopilot.Monster is a comprehensive enterprise-grade AI automation platform that provides a marketplace for AI agents, n8n workflows, and automation templates. Built with modern microservices architecture, it offers a complete solution for businesses looking to automate their operations.

## 🏗️ Architecture

### Microservices Architecture
- **API Gateway** (Port 3001) - Central entry point, routing, authentication
- **Auth Service** (Port 3002) - Authentication, authorization, user management
- **Catalog Service** (Port 3003) - Products, categories, reviews, search
- **Payment Service** (Port 3004) - Stripe, Razorpay, subscriptions, billing
- **License Service** (Port 3005) - License management, validation, tracking
- **Notification Service** (Port 3006) - Email, SMS, push notifications
- **User Service** (Port 3007) - User profiles, preferences, analytics
- **Vendor Service** (Port 3008) - Vendor management, KYC, payouts
- **Admin Service** (Port 3009) - Admin panel, system management
- **Content Service** (Port 3010) - Blog, help center, tutorials, resources

### Technology Stack
- **Backend**: NestJS, TypeScript, MongoDB, Redis, Kafka
- **Frontend**: Next.js 15, React, TypeScript, SCSS, Framer Motion
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session management and caching
- **Message Queue**: Apache Kafka for event-driven architecture
- **Search**: Elasticsearch for product search and analytics
- **Authentication**: JWT with role-based access control
- **Payments**: Stripe and Razorpay integration
- **Documentation**: Unified Swagger/OpenAPI documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- MongoDB 7.0+
- Redis 7.2+
- Apache Kafka
- Elasticsearch 8.11+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/autopilot.monster.git
cd autopilot.monster
```

2. **Start infrastructure services**
```bash
docker-compose up -d mongodb redis kafka elasticsearch
```

3. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install service dependencies
cd ../services/api-gateway
npm install

cd ../auth-service
npm install

cd ../catalog-service
npm install

cd ../payment-service
npm install

cd ../user-service
npm install

cd ../vendor-service
npm install
```

4. **Environment Configuration**
```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp services/api-gateway/.env.example services/api-gateway/.env
cp services/auth-service/.env.example services/auth-service/.env
cp services/catalog-service/.env.example services/catalog-service/.env
cp services/payment-service/.env.example services/payment-service/.env
cp services/user-service/.env.example services/user-service/.env
cp services/vendor-service/.env.example services/vendor-service/.env
```

5. **Start all services**
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start services individually
npm run start:dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:3001
- Swagger Documentation: http://localhost:3001/api-docs

## 📚 API Documentation

### Unified Swagger Documentation
Access the comprehensive API documentation at: **http://localhost:3001/api-docs**

The unified Swagger documentation includes:
- All microservice endpoints
- Authentication and authorization
- Request/response schemas
- Error handling
- Interactive API testing

### Key API Endpoints

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/profile
```

#### Products
```
GET    /api/v1/products
GET    /api/v1/products/:id
GET    /api/v1/products/search
GET    /api/v1/products/categories
POST   /api/v1/products/:id/reviews
```

#### Orders
```
POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id
```

#### Payments
```
POST   /api/v1/payments/create-intent
POST   /api/v1/payments/confirm
GET    /api/v1/payments/history
POST   /api/v1/payments/:id/refund
```

#### User Management
```
GET    /api/v1/users/profile
PATCH  /api/v1/users/profile
GET    /api/v1/users/orders
GET    /api/v1/users/wishlist
```

#### Vendor Management
```
GET    /api/v1/vendors/profile
PATCH  /api/v1/vendors/profile
POST   /api/v1/kyc/submit
GET    /api/v1/analytics/vendor
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user|vendor|admin",
  "permissions": ["read:products", "write:orders"],
  "iat": 1640995200,
  "exp": 1641081600,
  "iss": "autopilot.monster"
}
```

### Role-Based Access Control
- **User**: Basic access to marketplace, cart, orders
- **Vendor**: Product management, analytics, payouts
- **Admin**: Full system access, user management, analytics

## 🛒 Frontend Features

### Marketplace
- Product browsing and search
- Category filtering
- Advanced search with filters
- Product reviews and ratings
- Wishlist functionality

### User Dashboard
- Order history and tracking
- Download management
- Profile settings
- Analytics and insights

### Vendor Portal
- Product management
- Sales analytics
- KYC verification
- Payout management

### Admin Panel
- User management
- Vendor approval
- System analytics
- Content management

## 💳 Payment Integration

### Supported Payment Methods
- **Stripe**: Credit cards, digital wallets
- **Razorpay**: Indian payment methods
- **Subscription Management**: Recurring billing
- **Refund Processing**: Automated refund handling

### Pricing Models
- One-time purchases
- Monthly subscriptions
- Annual subscriptions
- Enterprise licensing

## 🔍 Search & Analytics

### Elasticsearch Integration
- Full-text product search
- Faceted search with filters
- Search analytics
- Recommendation engine

### Analytics Features
- User behavior tracking
- Sales analytics
- Performance metrics
- Custom reporting

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# Scale specific services
docker-compose up -d --scale api-gateway=3
```

### Production Environment
1. Set up production environment variables
2. Configure SSL certificates
3. Set up monitoring and logging
4. Configure backup strategies
5. Set up CI/CD pipelines

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/autopilot
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

# Payment
STRIPE_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_live_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific service tests
cd services/auth-service
npm test

# Run frontend tests
cd frontend
npm test

# Run e2e tests
npm run test:e2e
```

### Test Coverage
- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing

## 📊 Monitoring & Observability

### Health Checks
- Service health endpoints
- Database connectivity
- External service status
- Resource utilization

### Logging
- Structured JSON logging
- Request/response logging
- Error tracking with Sentry
- Performance metrics

### Metrics
- API response times
- Error rates
- User activity
- System resource usage

## 🔧 Development

### Code Structure
```
autopilot.monster/
├── frontend/                 # Next.js frontend application
├── services/                 # Microservices
│   ├── api-gateway/         # API Gateway service
│   ├── auth-service/        # Authentication service
│   ├── catalog-service/     # Product catalog service
│   ├── payment-service/     # Payment processing service
│   ├── user-service/        # User management service
│   ├── vendor-service/      # Vendor management service
│   └── ...
├── shared/                  # Shared utilities and types
├── docs/                    # Documentation
└── infrastructure/          # Infrastructure configuration
```

### Development Commands
```bash
# Start development environment
npm run dev

# Start specific service
cd services/auth-service
npm run start:dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.autopilot.monster](https://docs.autopilot.monster)
- **API Documentation**: [api-docs.autopilot.monster](https://api-docs.autopilot.monster)
- **Support Email**: support@autopilot.monster
- **Community**: [Discord](https://discord.gg/autopilot-monster)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core microservices architecture
- ✅ User authentication and authorization
- ✅ Product catalog and marketplace
- ✅ Payment processing
- ✅ Basic admin panel

### Phase 2 (Q2 2024)
- 🔄 Advanced analytics and reporting
- 🔄 Real-time notifications
- 🔄 Mobile application
- 🔄 API rate limiting and quotas

### Phase 3 (Q3 2024)
- 📋 AI-powered recommendations
- 📋 Advanced workflow automation
- 📋 Multi-tenant architecture
- 📋 Enterprise SSO integration

---

**Built with ❤️ by the Autopilot.Monster Team**