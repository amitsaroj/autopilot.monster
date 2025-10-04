# 🚀 Autopilot Monster - AI Agents & Automation Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%3E%3D20.0.0-blue)](https://www.docker.com/)

A comprehensive AI Agents & Automation Marketplace platform built with modern microservices architecture, featuring a complete e-commerce solution for AI tools, automation workflows, and digital products.

## 🎯 **Quick Start**

### **Option 1: Docker (Recommended)**
```bash
# Clone and start everything
git clone <repository-url>
cd autopilot.monster
docker compose up -d

# Access the platform
open http://localhost:3000
```

### **Option 2: Development Mode**
```bash
# Start all services
npm start

# Or manually
./start-dev.sh
```

## 📊 **Service Architecture**

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| **Frontend** | `3000` | Next.js application | ✅ Ready |
| **API Gateway** | `4000` | Main API endpoint | ✅ Ready |
| **Auth Service** | `3002` | Authentication & authorization | ✅ Ready |
| **Catalog Service** | `3003` | Product catalog & search | ✅ Ready |
| **Payment Service** | `3004` | Payment processing | ✅ Ready |
| **User Service** | `3005` | User management | ✅ Ready |
| **Vendor Service** | `3006` | Vendor management | ✅ Ready |
| **Admin Service** | `3007` | Admin panel | ✅ Ready |
| **Content Service** | `3008` | Content management | ✅ Ready |

## 🛠️ **Technology Stack**

### **Backend**
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Redis caching
- **Message Queue**: Apache Kafka
- **Search**: Elasticsearch
- **Authentication**: JWT with OAuth support
- **API Documentation**: Swagger/OpenAPI

### **Frontend**
- **Framework**: Next.js 15 with TypeScript
- **Styling**: SCSS with CSS Modules
- **Animations**: Framer Motion
- **State Management**: React Context + React Query
- **UI Components**: Custom component library

### **Infrastructure**
- **Containerization**: Docker & Docker Compose
- **Load Balancer**: Nginx
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions ready

## 🚀 **Available Commands**

### **Development**
```bash
npm start          # Start all services in development mode
npm stop           # Stop all services
npm run dev        # Alias for npm start
```

### **Individual Services**
```bash
npm run dev:gateway    # API Gateway (Port 4000)
npm run dev:auth       # Auth Service (Port 3002)
npm run dev:catalog    # Catalog Service (Port 3003)
npm run dev:payment    # Payment Service (Port 3004)
npm run dev:user       # User Service (Port 3005)
npm run dev:vendor     # Vendor Service (Port 3006)
npm run dev:admin      # Admin Service (Port 3007)
npm run dev:content    # Content Service (Port 3008)
npm run dev:frontend   # Frontend (Port 3000)
```

### **Building & Testing**
```bash
npm run build          # Build all services
npm run build:services # Build backend services only
npm run build:frontend # Build frontend only
npm run test           # Run all tests
npm run lint           # Lint all code
npm run clean          # Clean build artifacts
```

### **Docker Commands**
```bash
npm run docker:up      # Start Docker services
npm run docker:down    # Stop Docker services
npm run docker:logs    # View Docker logs
npm run docker:build   # Build Docker images
npm run docker:restart # Restart Docker services
```

### **Utilities**
```bash
npm run install:all    # Install dependencies for all services
npm run logs           # View service logs
npm run health         # Check service health
npm run docs           # Show API documentation URL
```

## 🌐 **Access Points**

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **API Gateway** | http://localhost:4000 | API endpoint |
| **API Documentation** | http://localhost:4000/api-docs | Swagger UI |
| **Grafana Dashboard** | http://localhost:3001 | Monitoring (admin/admin123) |
| **Prometheus** | http://localhost:9090 | Metrics |

## 📚 **API Documentation**

### **Authentication Endpoints**
```bash
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
POST /api/v1/auth/refresh      # Refresh token
POST /api/v1/auth/logout       # User logout
```

### **Marketplace Endpoints**
```bash
GET    /api/v1/marketplace/products           # Get all products
GET    /api/v1/marketplace/products/:id       # Get product by ID
POST   /api/v1/marketplace/search             # Search products
GET    /api/v1/marketplace/categories         # Get categories
```

### **User Management**
```bash
GET    /api/v1/user/profile                   # Get user profile
PUT    /api/v1/user/profile                   # Update user profile
GET    /api/v1/user/orders                    # Get user orders
GET    /api/v1/user/wishlist                  # Get user wishlist
```

### **Vendor Management**
```bash
GET    /api/v1/vendor/profile                 # Get vendor profile
PUT    /api/v1/vendor/profile                 # Update vendor profile
GET    /api/v1/vendor/products                # Get vendor products
POST   /api/v1/vendor/products                # Create product
```

## 🎨 **Frontend Features**

### **Pages & Components**
- ✅ **Homepage** - Hero section with featured products
- ✅ **Marketplace** - Product browsing and search
- ✅ **Product Details** - Detailed product information
- ✅ **Shopping Cart** - Cart management
- ✅ **Checkout** - Payment processing
- ✅ **User Dashboard** - Profile and order management
- ✅ **Vendor Portal** - Vendor dashboard and analytics
- ✅ **Admin Panel** - Administrative functions
- ✅ **Authentication** - Login/Register with dynamic navigation
- ✅ **Blog & Content** - Content management system

### **Authentication System**
- ✅ **Dynamic Navigation** - Login/logout with user menu
- ✅ **JWT Integration** - Secure token-based authentication
- ✅ **User Context** - Global authentication state
- ✅ **Protected Routes** - Route protection based on auth status
- ✅ **Social Login** - Google and GitHub OAuth support

## 🔧 **Configuration**

### **Environment Variables**
Create `.env` files for each service:

```bash
# API Gateway
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/autopilot_gateway
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key
```

### **Database Setup**
```bash
# Start MongoDB and Redis
docker compose up -d mongodb redis

# Or use local installations
mongod --dbpath /path/to/data
redis-server
```

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Port Conflicts**
```bash
# Check port usage
lsof -i :3000
lsof -i :4000

# Kill processes
kill -9 $(lsof -t -i:3000)
```

#### **Service Not Starting**
```bash
# Check logs
npm run logs
tail -f logs/api-gateway.log

# Restart services
npm stop && npm start
```

#### **Database Connection Issues**
```bash
# Check MongoDB
docker compose ps mongodb
docker compose logs mongodb

# Restart database
docker compose restart mongodb
```

#### **Build Errors**
```bash
# Clean and rebuild
npm run clean
npm run build

# Check TypeScript errors
npm run lint
```

### **Health Checks**
```bash
# Check API Gateway
curl http://localhost:4000/health

# Check individual services
curl http://localhost:3002/health  # Auth
curl http://localhost:3003/health  # Catalog
curl http://localhost:3004/health  # Payment
```

## 📊 **Monitoring**

### **Service Health**
- **API Gateway**: http://localhost:4000/health
- **System Status**: http://localhost:4000/api/v1/system/status
- **Grafana Dashboard**: http://localhost:3001 (admin/admin123)

### **Logs**
```bash
# View all logs
npm run logs

# View specific service logs
tail -f logs/api-gateway.log
tail -f logs/frontend.log
```

## 🚀 **Production Deployment**

### **Docker Production**
```bash
# Build and start production services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose ps
```

### **Environment Setup**
1. Set production environment variables
2. Configure SSL certificates
3. Set up monitoring and logging
4. Configure backup strategies

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md)
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

---

**🎉 Happy Coding with Autopilot Monster!**

Built with ❤️ using modern web technologies and best practices.