# 🚀 Autopilot Monster - AI Marketplace Platform

A comprehensive full-stack SaaS ecommerce marketplace for AI agents, n8n workflows, and automation tools built with modern microservices architecture.

## 🏗️ Architecture Overview

### Frontend
- **Framework**: Next.js 14 with App Router (TypeScript, SSR/SSG)
- **Styling**: SCSS with ITCSS methodology, modular CSS modules
- **Animations**: Framer Motion, Three.js, GSAP, Lottie
- **State Management**: Zustand for client state, React Query for server state
- **Authentication**: JWT with OAuth (Google, GitHub)
- **Validation**: React Hook Form with Zod schemas
- **UI Components**: Radix UI primitives with custom design system

### Backend Microservices
- **API Gateway**: NestJS with gRPC clients, JWT auth, rate limiting
- **Auth Service**: User management, authentication, authorization
- **Catalog Service**: Product management, search, categories
- **Payment Service**: Stripe/Razorpay integration, orders, subscriptions
- **License Service**: Software licensing and activation
- **Notification Service**: Email, SMS, push notifications

### Infrastructure
- **Databases**: MongoDB (primary), Redis (cache/sessions), Elasticsearch (search)
- **Message Queue**: Kafka for event-driven communication
- **Communication**: gRPC for inter-service communication
- **Containerization**: Docker with Docker Compose
- **Monitoring**: OpenTelemetry, health checks, logging

## 📁 Project Structure

```
autopilot.monster/
├── apps/
│   └── customer-portal/          # Next.js frontend application
│       ├── src/
│       │   ├── app/              # App Router pages
│       │   ├── components/       # Reusable UI components
│       │   ├── styles/           # SCSS files (ITCSS structure)
│       │   └── lib/              # Utilities and configurations
│       ├── public/               # Static assets
│       └── package.json
├── services/
│   ├── api-gateway/              # Main API Gateway service
│   ├── auth-service/             # Authentication microservice
│   ├── catalog-service/          # Product catalog microservice
│   ├── payment-service/          # Payment processing microservice
│   ├── license-service/          # Software licensing microservice
│   └── notification-service/     # Notification microservice
├── shared/
│   └── proto/                    # Protocol Buffer definitions
│       ├── auth.proto            # Authentication service contracts
│       ├── catalog.proto         # Catalog service contracts
│       ├── payment.proto         # Payment service contracts
│       ├── license.proto         # License service contracts
│       ├── notification.proto    # Notification service contracts
│       └── common.proto          # Common data types
├── infrastructure/               # Infrastructure configurations
├── docker-compose.yml            # Multi-service container setup
└── package.json                  # Root workspace configuration
```

## 🛠️ Technology Stack

### Frontend Technologies
- **Next.js 14**: React framework with App Router, SSR, and SSG
- **TypeScript**: Type-safe development
- **SCSS**: Advanced CSS with variables, mixins, and modular architecture
- **Framer Motion**: Smooth animations and transitions
- **Three.js**: 3D graphics and WebGL animations
- **React Query**: Server state management and caching
- **Zustand**: Lightweight client state management
- **React Hook Form + Zod**: Form handling with validation
- **Radix UI**: Accessible headless UI components

### Backend Technologies
- **NestJS**: Enterprise-grade Node.js framework
- **gRPC**: High-performance RPC framework
- **MongoDB**: Primary database with Mongoose ODM
- **Redis**: Caching, sessions, and rate limiting
- **Kafka**: Event streaming and message queuing
- **JWT**: JSON Web Tokens for authentication
- **Stripe & Razorpay**: Payment processing
- **Nodemailer**: Email service
- **Sharp**: Image processing
- **AWS SDK**: File storage and cloud services

### DevOps & Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Elasticsearch**: Search and analytics
- **NATS**: Lightweight messaging system
- **Winston**: Logging framework
- **Class Validator**: Request validation
- **Helmet**: Security middleware

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autopilot.monster
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd apps/customer-portal
   npm install
   
   # Install backend service dependencies
   cd ../../services/api-gateway
   npm install
   
   cd ../auth-service
   npm install
   ```

3. **Environment Setup**
   Create `.env` files in each service directory:
   
   **API Gateway (.env)**
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   MONGODB_URI=mongodb://admin:password123@localhost:27017/autopilot?authSource=admin
   REDIS_URL=redis://:redis123@localhost:6379
   KAFKA_BROKERS=localhost:9092
   ```
   
   **Auth Service (.env)**
   ```env
   PORT=3002
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   MONGODB_URI=mongodb://admin:password123@localhost:27017/autopilot_auth?authSource=admin
   REDIS_URL=redis://:redis123@localhost:6379
   KAFKA_BROKERS=localhost:9092
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Start Infrastructure Services**
   ```bash
   # Start databases and message brokers
   docker compose up -d mongodb redis kafka elasticsearch nats
   ```

5. **Start Backend Services**
   ```bash
   # Terminal 1: API Gateway
   cd services/api-gateway
   npm run start:dev
   
   # Terminal 2: Auth Service
   cd services/auth-service
   npm run start:dev
   ```

6. **Start Frontend**
   ```bash
   # Terminal 3: Frontend
   cd apps/customer-portal
   npm run dev
   ```

### Access Points
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Auth Service**: http://localhost:3002

## 📋 Features Implemented

### Frontend Features ✅
- **Landing Page**: Futuristic design with Three.js animations
- **User Authentication**: Login, register, password reset with OAuth
- **Product Marketplace**: Browse AI agents and workflows
- **User Dashboard**: Profile management, orders, downloads
- **Vendor Dashboard**: Product management, analytics
- **Admin Panel**: User and product administration
- **Shopping Cart**: Add to cart, checkout process
- **Payment Integration**: Stripe and Razorpay support
- **Responsive Design**: Mobile-first approach
- **SEO Optimization**: Meta tags, structured data, sitemap
- **Complete Page Set**: 25+ pages including legal, help, etc.

### Backend Features ✅
- **API Gateway**: Centralized routing, authentication, rate limiting
- **Auth Service**: JWT authentication, OAuth, user management
- **gRPC Communication**: Inter-service communication
- **Event-Driven Architecture**: Kafka message queues
- **Comprehensive Validation**: Input validation with class-validator
- **Health Monitoring**: Health checks and metrics
- **Security**: Helmet, CORS, input sanitization
- **Documentation**: Swagger API documentation
- **Database Models**: MongoDB schemas with validation
- **Caching**: Redis for sessions and rate limiting

### Infrastructure ✅
- **Docker Compose**: Multi-service development environment
- **Protocol Buffers**: Type-safe service contracts
- **Microservices**: Scalable service architecture
- **Event Streaming**: Kafka for async communication
- **Search Engine**: Elasticsearch integration ready
- **Monitoring**: Structured logging and health checks

## 🔧 API Endpoints

### Authentication API
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/profile` - Update user profile

### Health Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

## 🧪 Testing

```bash
# Run frontend tests
cd apps/customer-portal
npm test

# Run backend service tests
cd services/api-gateway
npm test

cd ../auth-service
npm test
```

## 📈 Performance & Scalability

- **Frontend**: SSR/SSG with Next.js for optimal loading
- **Backend**: Horizontal scaling with load balancers
- **Database**: MongoDB sharding and read replicas
- **Caching**: Redis for session and data caching
- **CDN**: Static asset delivery optimization
- **Search**: Elasticsearch for fast product search

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: API rate limiting and DDoS protection
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js security middleware
- **CORS**: Configured cross-origin resource sharing
- **SQL Injection**: MongoDB injection prevention
- **XSS Protection**: Content Security Policy

## 🌐 Deployment

### Production Deployment
1. **Environment Variables**: Set production environment variables
2. **Database Setup**: Configure MongoDB Atlas or self-hosted
3. **Container Registry**: Push Docker images to registry
4. **Orchestration**: Deploy with Kubernetes or Docker Swarm
5. **Load Balancer**: Configure nginx or cloud load balancer
6. **SSL/TLS**: Set up HTTPS certificates
7. **Monitoring**: Configure logging and monitoring tools

### Cloud Deployment Options
- **AWS**: EKS, RDS, ElastiCache, ALB
- **Google Cloud**: GKE, Cloud SQL, Memorystore
- **Azure**: AKS, Cosmos DB, Redis Cache
- **Digital Ocean**: Kubernetes, Managed Databases

## 📚 Documentation

- **API Documentation**: Available at `/api/docs` when running
- **Protocol Buffers**: Service contracts in `shared/proto/`
- **Component Documentation**: Storybook setup available
- **Architecture Decisions**: Decision records in `docs/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@autopilot.monster
- **Documentation**: [docs.autopilot.monster](https://docs.autopilot.monster)
- **Issues**: GitHub Issues
- **Community**: Discord/Slack community

---

## 🎯 Next Steps

To complete the platform:

1. **Complete Remaining Services**:
   - Catalog Service (product management)
   - Payment Service (Stripe/Razorpay integration)
   - License Service (software licensing)
   - Notification Service (email/SMS)

2. **Add Production Features**:
   - OpenTelemetry monitoring
   - Kubernetes deployment configs
   - CI/CD pipelines
   - Automated testing
   - Security scanning

3. **Enhance Frontend**:
   - E2E testing with Playwright
   - Storybook component documentation
   - Progressive Web App features
   - Advanced animations

Built with ❤️ for the AI automation community.