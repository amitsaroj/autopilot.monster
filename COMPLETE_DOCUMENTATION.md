# 🚀 Autopilot Monster - Complete Platform Documentation

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Port Configuration](#port-configuration)
4. [Services Overview](#services-overview)
5. [Installation & Setup](#installation--setup)
6. [Development Commands](#development-commands)
7. [Production Deployment](#production-deployment)
8. [API Documentation](#api-documentation)
9. [Frontend Integration](#frontend-integration)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 **Overview**

Autopilot Monster is a comprehensive AI Agents & Automation Marketplace platform built with:
- **Backend**: NestJS microservices architecture
- **Frontend**: Next.js 15 with TypeScript
- **Database**: MongoDB with Redis caching
- **Message Queue**: Apache Kafka
- **Search**: Elasticsearch
- **Containerization**: Docker & Docker Compose

---

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Microservices │
│   (Next.js)     │◄──►│   (Port 4000)   │◄──►│   (Ports 3002-8)│
│   (Port 3000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Message Queue │    │   Databases     │
│   (Nginx)       │    │   (Kafka)       │    │   (MongoDB)     │
│   (Port 80/443) │    │   (Port 9092)   │    │   (Port 27017)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔌 **Port Configuration**

### **Production Ports (Docker)**
| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | `3000` | Next.js application |
| **API Gateway** | `4000` | Main API endpoint |
| **Auth Service** | `3002` | Authentication & authorization |
| **Catalog Service** | `3003` | Product catalog & search |
| **Payment Service** | `3004` | Payment processing |
| **User Service** | `3005` | User management |
| **Vendor Service** | `3006` | Vendor management |
| **Admin Service** | `3007` | Admin panel |
| **Content Service** | `3008` | Content management |
| **MongoDB** | `27017` | Primary database |
| **Redis** | `6379` | Caching layer |
| **Kafka** | `9092` | Message broker |
| **Elasticsearch** | `9200` | Search engine |
| **Nginx** | `80/443` | Load balancer |

### **Development Ports (Local)**
| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | `3000` | Next.js dev server |
| **API Gateway** | `4000` | API Gateway dev server |
| **Auth Service** | `3002` | Auth service dev server |
| **Catalog Service** | `3003` | Catalog service dev server |
| **Payment Service** | `3004` | Payment service dev server |
| **User Service** | `3005` | User service dev server |
| **Vendor Service** | `3006` | Vendor service dev server |
| **Admin Service** | `3007` | Admin service dev server |
| **Content Service** | `3008` | Content service dev server |

---

## 🛠️ **Services Overview**

### **1. API Gateway (Port 4000)**
- **Purpose**: Central entry point for all API requests
- **Technology**: NestJS
- **Features**: 
  - Request routing
  - Authentication middleware
  - Rate limiting
  - API documentation (Swagger)
  - Load balancing

### **2. Auth Service (Port 3002)**
- **Purpose**: User authentication & authorization
- **Technology**: NestJS + JWT
- **Features**:
  - User registration/login
  - JWT token management
  - OAuth integration (Google, GitHub)
  - Password reset
  - Account verification

### **3. Catalog Service (Port 3003)**
- **Purpose**: Product catalog & search
- **Technology**: NestJS + Elasticsearch
- **Features**:
  - Product CRUD operations
  - Advanced search & filtering
  - Category management
  - Product reviews & ratings

### **4. Payment Service (Port 3004)**
- **Purpose**: Payment processing
- **Technology**: NestJS + Stripe/Razorpay
- **Features**:
  - Payment processing
  - Subscription management
  - Refund handling
  - Payment analytics

### **5. User Service (Port 3005)**
- **Purpose**: User profile management
- **Technology**: NestJS + MongoDB
- **Features**:
  - User profiles
  - Order history
  - Wishlist management
  - User analytics

### **6. Vendor Service (Port 3006)**
- **Purpose**: Vendor management
- **Technology**: NestJS + MongoDB
- **Features**:
  - Vendor registration
  - Product management
  - Order fulfillment
  - Analytics dashboard

### **7. Admin Service (Port 3007)**
- **Purpose**: Administrative functions
- **Technology**: NestJS + MongoDB
- **Features**:
  - User management
  - Vendor approval
  - System monitoring
  - Analytics reporting

### **8. Content Service (Port 3008)**
- **Purpose**: Content management
- **Technology**: NestJS + MongoDB
- **Features**:
  - Blog management
  - Help center
  - Tutorials
  - Press releases

---

## 🚀 **Installation & Setup**

### **Prerequisites**
- Node.js 18+ 
- Docker & Docker Compose
- MongoDB (if running locally)
- Redis (if running locally)

### **Quick Start (Docker - Recommended)**

```bash
# Clone the repository
git clone <repository-url>
cd autopilot.monster

# Start all services
docker compose up -d

# Check service status
docker compose ps
```

### **Development Setup**

```bash
# Install dependencies for all services
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Start infrastructure services
docker compose up -d mongodb redis kafka elasticsearch

# Start all backend services
npm run dev

# Start frontend (in separate terminal)
cd frontend && npm run dev
```

---

## ⚡ **Development Commands**

### **Root Level Commands**
```bash
# Start all services in development mode
npm run dev

# Build all services
npm run build

# Run tests for all services
npm run test

# Start Docker services
npm run docker:up

# Stop Docker services
npm run docker:down

# View Docker logs
npm run docker:logs
```

### **Individual Service Commands**
```bash
# API Gateway
cd services/api-gateway
npm run start:dev    # Development mode
npm run build        # Build for production
npm run start:prod   # Production mode

# Auth Service
cd services/auth-service
npm run start:dev    # Development mode
npm run build        # Build for production
npm run start:prod   # Production mode

# Frontend
cd frontend
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Production mode
```

### **Docker Commands**
```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up -d api-gateway

# View logs
docker compose logs -f api-gateway

# Rebuild and restart
docker compose up -d --build

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

---

## 🌐 **Production Deployment**

### **Environment Variables**
Create `.env` files for each service with production values:

```bash
# API Gateway .env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/autopilot_gateway?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=password123
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
```

### **Production Build**
```bash
# Build all services
npm run build

# Start with Docker Compose
docker compose -f docker-compose.prod.yml up -d
```

---

## 📚 **API Documentation**

### **Swagger Documentation**
- **URL**: `http://localhost:4000/api-docs`
- **Authentication**: Bearer token required for protected endpoints

### **API Endpoints**

#### **Authentication**
```
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
POST /api/v1/auth/refresh      # Refresh token
POST /api/v1/auth/logout       # User logout
```

#### **Products**
```
GET    /api/v1/marketplace/products           # Get all products
GET    /api/v1/marketplace/products/:id       # Get product by ID
POST   /api/v1/marketplace/search             # Search products
GET    /api/v1/marketplace/categories         # Get categories
```

#### **User Management**
```
GET    /api/v1/user/profile                   # Get user profile
PUT    /api/v1/user/profile                   # Update user profile
GET    /api/v1/user/orders                    # Get user orders
GET    /api/v1/user/wishlist                  # Get user wishlist
```

#### **Vendor Management**
```
GET    /api/v1/vendor/profile                 # Get vendor profile
PUT    /api/v1/vendor/profile                 # Update vendor profile
GET    /api/v1/vendor/products                # Get vendor products
POST   /api/v1/vendor/products                # Create product
```

---

## 🎨 **Frontend Integration**

### **API Client Configuration**
The frontend uses a centralized API client located at `frontend/src/lib/api/client.ts`:

```typescript
// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Available API modules
import { 
  authApi,      // Authentication
  userApi,      // User management
  vendorApi,    // Vendor operations
  contentApi,   // Content management
  systemApi,    // System operations
  marketplaceApi, // Marketplace operations
  cartApi,      // Shopping cart
  checkoutApi   // Checkout process
} from '@/lib/api/client';
```

### **Authentication Integration**
The frontend includes a complete authentication system:

```typescript
// Authentication context
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

### **Page Integration**
All frontend pages are integrated with backend APIs:

- **Dashboard**: `/dashboard` - User profile and analytics
- **Marketplace**: `/marketplace` - Product browsing and search
- **Cart**: `/cart` - Shopping cart management
- **Vendor Portal**: `/vendor` - Vendor dashboard
- **Admin Panel**: `/admin` - Administrative functions

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Port Conflicts**
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :4000

# Kill processes using ports
kill -9 $(lsof -t -i:3000)
```

#### **2. Database Connection Issues**
```bash
# Check MongoDB status
docker compose ps mongodb

# View MongoDB logs
docker compose logs mongodb

# Restart MongoDB
docker compose restart mongodb
```

#### **3. Service Build Errors**
```bash
# Clean and rebuild
npm run clean
npm run build

# Check for TypeScript errors
npm run type-check
```

#### **4. Frontend Build Issues**
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run build
```

### **Health Checks**
```bash
# Check API Gateway health
curl http://localhost:4000/health

# Check individual services
curl http://localhost:3002/health  # Auth Service
curl http://localhost:3003/health  # Catalog Service
curl http://localhost:3004/health  # Payment Service
```

### **Logs**
```bash
# View all service logs
docker compose logs -f

# View specific service logs
docker compose logs -f api-gateway
docker compose logs -f auth-service
```

---

## 📊 **Monitoring & Analytics**

### **Available Endpoints**
- **System Status**: `http://localhost:4000/api/v1/system/status`
- **Health Check**: `http://localhost:4000/health`
- **API Documentation**: `http://localhost:4000/api-docs`

### **Grafana Dashboard**
- **URL**: `http://localhost:3001`
- **Username**: `admin`
- **Password**: `admin123`

---

## 🎯 **Quick Reference**

### **Start Everything**
```bash
docker compose up -d
```

### **Stop Everything**
```bash
docker compose down
```

### **View Logs**
```bash
docker compose logs -f
```

### **Rebuild Services**
```bash
docker compose up -d --build
```

### **Access Points**
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:4000
- **API Docs**: http://localhost:4000/api-docs
- **Grafana**: http://localhost:3001

---

## 📞 **Support**

For issues and questions:
1. Check the troubleshooting section above
2. Review service logs: `docker compose logs -f [service-name]`
3. Verify port configurations
4. Ensure all dependencies are installed

---

**🎉 Happy Coding with Autopilot Monster!**
