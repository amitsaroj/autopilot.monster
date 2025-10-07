# 🛠️ Complete Setup Guide - Autopilot Monster

This comprehensive guide will walk you through setting up the Autopilot Monster platform from scratch on your local development environment.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Infrastructure Setup](#infrastructure-setup)
5. [Services Configuration](#services-configuration)
6. [Frontend Setup](#frontend-setup)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Development Workflow](#development-workflow)

---

## 💻 System Requirements

### Minimum Requirements

- **OS**: macOS 10.15+, Ubuntu 20.04+, Windows 10/11 with WSL2
- **RAM**: 8GB (16GB recommended for running all services)
- **Disk Space**: 10GB free space
- **CPU**: 4 cores (8 cores recommended)
- **Internet**: Stable broadband connection

### Recommended Setup

- **RAM**: 16GB or more
- **CPU**: 8 cores or more
- **SSD**: For faster build and startup times
- **Terminal**: iTerm2 (macOS), Windows Terminal, or any modern terminal

---

## 📦 Prerequisites Installation

### 1. Node.js and npm

**Required Version**: Node.js >= 18.0.0, npm >= 9.0.0

#### macOS (using Homebrew)

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Verify installation
node --version  # Should be 18.x.x or higher
npm --version   # Should be 9.x.x or higher
```

#### Ubuntu/Debian

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Windows (using Chocolatey)

```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs-lts

# Verify installation
node --version
npm --version
```

#### Alternative: Using nvm (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then install Node.js
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
npm --version
```

### 2. Docker Desktop

Docker is essential for running infrastructure services (MongoDB, Redis, Kafka, etc.)

#### macOS

```bash
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Or using Homebrew
brew install --cask docker

# Start Docker Desktop from Applications
# Verify installation
docker --version
docker-compose --version
```

#### Ubuntu

```bash
# Update package index
sudo apt-get update

# Install dependencies
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation (may need to log out and back in)
docker --version
docker compose version
```

#### Windows

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Run the installer
3. Enable WSL2 backend during installation
4. Restart your computer
5. Start Docker Desktop
6. Verify in PowerShell:

```powershell
docker --version
docker-compose --version
```

### 3. Git

```bash
# macOS
brew install git

# Ubuntu
sudo apt-get install -y git

# Windows (Chocolatey)
choco install git

# Verify
git --version
```

### 4. Optional Tools

```bash
# Visual Studio Code
brew install --cask visual-studio-code  # macOS
# Or download from: https://code.visualstudio.com/

# Postman (for API testing)
brew install --cask postman  # macOS
# Or download from: https://www.postman.com/downloads/

# MongoDB Compass (database GUI)
brew install --cask mongodb-compass  # macOS
# Or download from: https://www.mongodb.com/products/compass
```

---

## 🚀 Project Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/autopilot.monster.git

# Navigate to project directory
cd autopilot.monster

# Verify directory structure
ls -la
```

You should see:
- `frontend/` - Next.js application
- `services/` - Microservices
- `shared/` - Shared configuration
- `docs/` - Documentation
- `docker-compose.yml` and `docker-compose.prod.yml`

### Step 2: Install Root Dependencies

```bash
# Install root package dependencies
npm install

# This installs shared utilities and scripts
```

### Step 3: Install Shared Module Dependencies

```bash
# Navigate to shared directory
cd shared

# Install dependencies
npm install

# Return to root
cd ..
```

### Step 4: Install Service Dependencies

You can install all services at once using the provided script:

```bash
# Option 1: Using the provided script (Recommended)
chmod +x install-and-start.sh
./install-and-start.sh

# This script will:
# - Install all service dependencies
# - Install frontend dependencies
# - Start infrastructure
# - Start all services
```

Or manually install each service:

```bash
# Option 2: Manual installation

# API Gateway
cd services/api-gateway-node
npm install
cd ../..

# Auth Service
cd services/auth-service-node
npm install
cd ../..

# User Service
cd services/user-service-node
npm install
cd ../..

# Marketplace Service
cd services/marketplace-service-node
npm install
cd ../..

# Cart Service
cd services/cart-service-node
npm install
cd ../..

# Order Service
cd services/order-service-node
npm install
cd ../..

# Vendor Service
cd services/vendor-service-node
npm install
cd ../..

# Content Service
cd services/content-service-node
npm install
cd ../..

# Admin Service
cd services/admin-service-node
npm install
cd ../..
```

### Step 5: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Return to root
cd ..
```

**Note**: Frontend installation may take 5-10 minutes due to Next.js dependencies.

---

## 🏗️ Infrastructure Setup

### Understanding the Infrastructure

The platform requires several infrastructure services:

- **MongoDB** (Port 27017) - Primary database
- **Redis** (Port 6379) - Caching and session management
- **Kafka** (Port 9092) - Event streaming
- **Zookeeper** (Port 2181) - Kafka coordination
- **Elasticsearch** (Port 9200) - Search engine (optional)

### Start Infrastructure Services

```bash
# Start all infrastructure services using Docker Compose
docker-compose up -d mongodb redis kafka zookeeper elasticsearch

# The -d flag runs containers in detached mode (background)
```

### Verify Infrastructure Services

```bash
# Check if all containers are running
docker-compose ps

# You should see all services with "Up" status

# View logs (optional)
docker-compose logs -f mongodb
docker-compose logs -f redis
docker-compose logs -f kafka
```

### Test Infrastructure Connectivity

```bash
# Test MongoDB
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Test Redis
docker-compose exec redis redis-cli -a password123 ping
# Should return: PONG

# Test Elasticsearch
curl http://localhost:9200
# Should return JSON with cluster information
```

---

## ⚙️ Services Configuration

### Environment Variables

Each service needs environment variables. For development, these are set in `docker-compose.prod.yml`. For local development outside Docker, you can create `.env` files.

### Create Environment Files (Optional)

If running services locally without Docker:

```bash
# Example: Auth Service .env file
cd services/auth-service-node

cat > .env << EOF
NODE_ENV=development
AUTH_SERVICE_PORT=4002
AUTH_DB_URL=mongodb://admin:password123@localhost:27017/auth_db?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password123
KAFKA_BROKERS=localhost:9092
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
EOF

cd ../..
```

Repeat for other services, adjusting ports and database URLs.

### Build Services

```bash
# Build all services
npm run build:services

# Or build individual services
cd services/auth-service-node
npm run build
cd ../..
```

---

## 🎨 Frontend Setup

### Configuration

```bash
cd frontend

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NODE_ENV=development
EOF
```

### Build Frontend (Optional)

```bash
# Development mode doesn't require building
# But you can build for production testing

npm run build
```

---

## ▶️ Starting Services

### Option 1: Using the Start Script (Recommended)

```bash
# From project root
./start-all-services.sh

# This script starts all 9 microservices in the background
# Logs are saved to the logs/ directory
```

### Option 2: Manual Start

Open separate terminal windows for each service:

```bash
# Terminal 1: API Gateway
cd services/api-gateway-node && npm run dev

# Terminal 2: Auth Service
cd services/auth-service-node && npm run dev

# Terminal 3: User Service
cd services/user-service-node && npm run dev

# Terminal 4: Marketplace Service
cd services/marketplace-service-node && npm run dev

# Terminal 5: Cart Service
cd services/cart-service-node && npm run dev

# Terminal 6: Order Service
cd services/order-service-node && npm run dev

# Terminal 7: Vendor Service
cd services/vendor-service-node && npm run dev

# Terminal 8: Content Service
cd services/content-service-node && npm run dev

# Terminal 9: Admin Service
cd services/admin-service-node && npm run dev
```

### Start Frontend

```bash
# In a new terminal
cd frontend
npm run dev
```

### Service Startup Order

If starting manually, follow this order for dependencies:

1. **Infrastructure** (MongoDB, Redis, Kafka, Zookeeper)
2. **Auth Service** (Port 4002) - Required by other services
3. **User Service** (Port 4005)
4. **Marketplace Service** (Port 4003)
5. **Cart Service** (Port 4009)
6. **Order Service** (Port 4004)
7. **Vendor Service** (Port 4006)
8. **Content Service** (Port 4008)
9. **Admin Service** (Port 4007)
10. **API Gateway** (Port 4000) - Should start last
11. **Frontend** (Port 3000)

---

## ✅ Verification

### 1. Check All Services

```bash
# Check API Gateway health (includes all services)
curl http://localhost:4000/health

# You should see all services as "healthy"
```

Expected response:
```json
{
  "status": "ok",
  "gateway": "api-gateway",
  "version": "1.0.0",
  "uptime": 123.45,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": [
    { "service": "auth", "status": "healthy", "url": "http://localhost:4002" },
    { "service": "user", "status": "healthy", "url": "http://localhost:4005" },
    { "service": "marketplace", "status": "healthy", "url": "http://localhost:4003" },
    { "service": "cart", "status": "healthy", "url": "http://localhost:4009" },
    { "service": "order", "status": "healthy", "url": "http://localhost:4004" },
    { "service": "vendor", "status": "healthy", "url": "http://localhost:4006" },
    { "service": "content", "status": "healthy", "url": "http://localhost:4008" },
    { "service": "admin", "status": "healthy", "url": "http://localhost:4007" }
  ]
}
```

### 2. Access Swagger Documentation

Open your browser and navigate to:

**http://localhost:4000/api-docs**

You should see the unified API documentation with all endpoints from all services.

### 3. Access Frontend

Open your browser and navigate to:

**http://localhost:3000**

You should see the homepage of the Autopilot Monster platform.

### 4. Test a Complete Flow

```bash
# Register a new user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'

# Save the returned JWT token

# Get products (using the JWT token)
curl -X GET http://localhost:4000/api/marketplace/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 5. Check Logs

```bash
# View all service logs
tail -f logs/combined.log

# View specific service logs
tail -f logs/auth-service.log
tail -f logs/user-service.log

# View error logs only
tail -f logs/error.log
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process using a port (example: 4000)
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or find and kill in one command
lsof -ti :4000 | xargs kill -9
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Restart MongoDB
docker-compose restart mongodb

# View MongoDB logs
docker-compose logs mongodb

# Connect to MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

### Redis Connection Failed

```bash
# Check if Redis is running
docker-compose ps redis

# Restart Redis
docker-compose restart redis

# Test Redis connection
docker-compose exec redis redis-cli -a password123 ping

# View Redis logs
docker-compose logs redis
```

### Kafka Connection Issues

```bash
# Ensure Zookeeper is running first
docker-compose ps zookeeper

# Restart Kafka and Zookeeper
docker-compose restart zookeeper
docker-compose restart kafka

# View Kafka logs
docker-compose logs kafka

# View Zookeeper logs
docker-compose logs zookeeper
```

### Service Won't Start

```bash
# Check the service logs
tail -f logs/[service-name].log

# Common issues:
# 1. Port already in use - kill the process using that port
# 2. Missing dependencies - run npm install again
# 3. Database connection failed - check if MongoDB is running
# 4. Build errors - run npm run clean && npm run build
```

### Frontend Build Errors

```bash
cd frontend

# Clear cache
rm -rf .next node_modules package-lock.json

# Reinstall dependencies
npm install

# Try building again
npm run build

# If still failing, check for TypeScript errors
npm run lint
```

### Docker Disk Space Issues

```bash
# Check Docker disk usage
docker system df

# Clean up unused containers, networks, images
docker system prune -a

# Remove all stopped containers
docker container prune

# Remove unused volumes
docker volume prune
```

### Elasticsearch Not Starting

Elasticsearch requires more memory:

```bash
# On Linux, increase vm.max_map_count
sudo sysctl -w vm.max_map_count=262144

# To make it permanent
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf

# On macOS/Windows Docker Desktop
# Go to Docker Desktop -> Preferences -> Resources
# Increase Memory to at least 4GB
```

### Permission Issues (Linux)

```bash
# Fix permissions for project directory
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -aG docker $USER

# Log out and log back in for changes to take effect
```

---

## 🔄 Development Workflow

### Daily Development Routine

```bash
# 1. Start infrastructure (if not running)
docker-compose up -d mongodb redis kafka zookeeper

# 2. Start all services
./start-all-services.sh

# 3. Start frontend in development mode
cd frontend && npm run dev

# 4. Make your changes

# 5. View logs
tail -f logs/combined.log

# 6. Test your changes
curl http://localhost:4000/api/[your-endpoint]

# 7. Stop services when done
./stop-all-services.sh
```

### Git Workflow

```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Make changes

# Stage and commit
git add .
git commit -m "feat: description of your changes"

# Push to remote
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

### Testing Your Changes

```bash
# Test using Swagger UI
open http://localhost:4000/api-docs

# Test using curl
curl -X GET http://localhost:4000/api/[endpoint]

# Test using Postman
# Import the OpenAPI spec from http://localhost:4000/api-docs-json
```

### Debugging

```bash
# Enable verbose logging
NODE_ENV=development npm run dev

# Debug a specific service
cd services/auth-service-node
node --inspect dist/index.js

# Attach debugger in VS Code
# Create a launch.json configuration:
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Auth Service",
  "port": 9229
}
```

### Rebuilding Services

```bash
# Clean all build artifacts
npm run clean

# Build all services
npm run build:services

# Build specific service
cd services/auth-service-node
npm run clean
npm run build
cd ../..
```

---

## 📊 Monitoring Setup (Optional)

### Prometheus & Grafana

```bash
# Start monitoring stack
docker-compose up -d prometheus grafana

# Access Prometheus
open http://localhost:9090

# Access Grafana
open http://localhost:3001
# Username: admin
# Password: admin123

# Import dashboards from monitoring/grafana/dashboards/
```

---

## 🎓 Next Steps

After completing setup:

1. **Read the Architecture Documentation**
   - [Technical Architecture](./technical-architecture.md)
   - [Backend Services](./backend-services.md)
   - [API Architecture](./api-architecture.md)

2. **Explore the API**
   - Test endpoints using Swagger UI
   - Try the example API calls in the README

3. **Review the Code**
   - Understand the service structure
   - Review shared configuration
   - Explore frontend components

4. **Start Contributing**
   - Check [PROJECT_STATUS.md](../PROJECT_STATUS.md) for pending tasks
   - Pick an issue from GitHub
   - Follow the contribution guidelines

---

## 💡 Tips & Best Practices

### Development Tips

1. **Use multiple terminal tabs** - One for each service you're actively developing
2. **Enable auto-restart** - Services use `ts-node-dev` for hot reloading
3. **Check health endpoints** - Before testing, ensure all services are healthy
4. **Use Swagger UI** - Interactive API testing is faster than curl
5. **Monitor logs** - Keep a terminal open with `tail -f logs/combined.log`

### Performance Tips

1. **Don't run all services** - Only start services you need for your feature
2. **Use production mode** - For performance testing, build and run in production mode
3. **Allocate enough RAM** - Docker Desktop needs at least 4GB, 8GB recommended
4. **Use SSD** - Significantly improves build times and service startup

### Security Tips

1. **Never commit secrets** - Add `.env` files to `.gitignore`
2. **Use strong passwords** - Change default passwords for production
3. **Rotate JWT secrets** - Use different secrets for each environment
4. **Keep dependencies updated** - Run `npm audit` regularly

---

## 📞 Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting section](#troubleshooting) above
2. Review the [PROJECT_STATUS.md](../PROJECT_STATUS.md) for known issues
3. Search existing GitHub issues
4. Create a new GitHub issue with detailed information:
   - What you were trying to do
   - What happened instead
   - Error messages
   - Your environment (OS, Node version, Docker version)

---

## ✅ Setup Checklist

Use this checklist to ensure everything is properly configured:

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Repository cloned
- [ ] Root dependencies installed
- [ ] Shared module dependencies installed
- [ ] All service dependencies installed
- [ ] Frontend dependencies installed
- [ ] Infrastructure services running (MongoDB, Redis, Kafka)
- [ ] All microservices starting successfully
- [ ] Frontend running on port 3000
- [ ] API Gateway responding on port 4000
- [ ] Swagger documentation accessible
- [ ] Health check endpoint returning "healthy" for all services
- [ ] Test user registration successful
- [ ] Test login successful
- [ ] Test API call with JWT token successful

---

**Setup Complete!** 🎉

You're now ready to develop on the Autopilot Monster platform!

<div align="center">

**[⬆ Back to Top](#-complete-setup-guide---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>

