# 🚀 Autopilot Monster - Setup Instructions

## Prerequisites

Before running the services, you need to have the following installed:

### 1. Node.js (Required)
- **Version:** 18.x or higher
- **Check:** `node --version`
- **Install:** https://nodejs.org/

### 2. MongoDB (Required)
- **Version:** 7.0 or higher
- **Check:** `mongod --version`
  
**Install Options:**

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7.0
```

**Option B: macOS (Homebrew)**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Option C: Linux (Ubuntu/Debian)**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 3. Redis (Required)
- **Version:** 7.x or higher
- **Check:** `redis-server --version`

**Install Options:**

**Option A: Docker (Recommended)**
```bash
docker run -d -p 6379:6379 --name redis \
  redis:7.2-alpine redis-server --requirepass password123
```

**Option B: macOS (Homebrew)**
```bash
brew install redis
brew services start redis
# Set password in /usr/local/etc/redis.conf
```

**Option C: Linux (Ubuntu/Debian)**
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### 4. Apache Kafka (Required)
- **Version:** 3.x or higher

**Option A: Docker (Recommended)**
```bash
# Start Zookeeper
docker run -d -p 2181:2181 --name zookeeper \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  confluentinc/cp-zookeeper:7.4.0

# Start Kafka
docker run -d -p 9092:9092 --name kafka \
  --link zookeeper \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:7.4.0
```

**Option B: Docker Compose (All Services)**
```bash
cd /path/to/autopilot.monster
docker-compose up -d mongodb redis zookeeper kafka
```

### 5. Elasticsearch (Optional - for search features)
```bash
docker run -d -p 9200:9200 -p 9300:9300 --name elasticsearch \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

## Quick Start

### Step 1: Install Dependencies
```bash
cd /Users/amitsaroj/Desktop/autopilot.monster
chmod +x install-and-start.sh stop-services.sh
```

### Step 2: Copy Environment File
```bash
# Create .env file from example (if using environment file setup)
cp .env.example .env
# Edit .env with your configuration
```

### Step 3: Start All Infrastructure Services

**If using Docker:**
```bash
docker-compose up -d mongodb redis kafka zookeeper
```

**Or start services individually (see Prerequisites above)**

### Step 4: Install & Start Application Services
```bash
./install-and-start.sh
```

This script will:
- ✅ Install dependencies for shared config
- ✅ Install dependencies for each service
- ✅ Start all microservices
- ✅ Display service URLs and health status

### Step 5: Verify Services
```bash
# Check Auth Service
curl http://localhost:4002/health

# View API Documentation
open http://localhost:4002/api-docs

# View logs
tail -f logs/auth-service.log
```

## Service Ports

| Service | Port | Documentation | Health Check |
|---------|------|---------------|--------------|
| **API Gateway** | 4000 | http://localhost:4000/api-docs | http://localhost:4000/health |
| **Auth Service** | 4002 | http://localhost:4002/api-docs | http://localhost:4002/health |
| **User Service** | 4005 | http://localhost:4005/api-docs | http://localhost:4005/health |
| **Marketplace** | 4003 | http://localhost:4003/api-docs | http://localhost:4003/health |
| **Cart Service** | 4009 | http://localhost:4009/api-docs | http://localhost:4009/health |
| **Order Service** | 4004 | http://localhost:4004/api-docs | http://localhost:4004/health |
| **Vendor Service** | 4006 | http://localhost:4006/api-docs | http://localhost:4006/health |
| **Content Service** | 4008 | http://localhost:4008/api-docs | http://localhost:4008/health |
| **Admin Service** | 4007 | http://localhost:4007/api-docs | http://localhost:4007/health |

## Stopping Services

```bash
./stop-services.sh
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -ti:4002

# Kill process
kill -9 $(lsof -ti:4002)
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check connection string in .env
# Default: mongodb://localhost:27017/auth_db
```

### Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

### Kafka Connection Failed
```bash
# Check if Kafka is running
kafka-topics.sh --list --bootstrap-server localhost:9092

# Or check Docker container
docker logs kafka
```

### View Service Logs
```bash
# All logs
tail -f logs/*.log

# Specific service
tail -f logs/auth-service.log

# With grep filtering
tail -f logs/auth-service.log | grep ERROR
```

### Clear Logs and Restart
```bash
./stop-services.sh
rm -rf logs/*.log logs/*.pid
./install-and-start.sh
```

## Development Workflow

### Running Individual Service
```bash
cd services/auth-service-node
npm run dev
```

### Building for Production
```bash
cd services/auth-service-node
npm run build
npm start
```

### Adding New Dependencies
```bash
cd services/auth-service-node
npm install <package-name>
```

## Testing APIs

### Register a User
```bash
curl -X POST http://localhost:4002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (with JWT token)
```bash
curl http://localhost:4002/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture Overview

```
┌─────────────────┐
│  API Gateway    │ :4000
│  (Aggregator)   │
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┬─────────┐
    │         │        │          │         │
┌───▼───┐ ┌──▼───┐ ┌──▼────┐ ┌───▼────┐ ┌─▼─────┐
│ Auth  │ │ User │ │Market │ │ Vendor │ │ Admin │
│ 4002  │ │ 4005 │ │ 4003  │ │ 4006   │ │ 4007  │
└───┬───┘ └──┬───┘ └──┬────┘ └───┬────┘ └───┬───┘
    │        │        │          │          │
┌───▼────────▼────────▼──────────▼──────────▼───┐
│              Apache Kafka (Events)             │
│                   :9092                         │
└────────────────────────────────────────────────┘
    │        │        │          │          │
┌───▼───┐ ┌──▼───┐ ┌──▼────┐ ┌───▼────┐ ┌─▼─────┐
│auth_db│ │user_ │ │market_│ │vendor_ │ │admin_ │
│       │ │  db  │ │  db   │ │   db   │ │  db   │
└───────┘ └──────┘ └───────┘ └────────┘ └───────┘
```

## Next Steps

1. ✅ Install prerequisites (MongoDB, Redis, Kafka)
2. ✅ Run `./install-and-start.sh`
3. ✅ Verify all services are healthy
4. ✅ Test API endpoints
5. ✅ Check API documentation at `/api-docs`
6. 🔄 Integrate with frontend (already on port 3000)

## Support

For issues or questions:
- Check logs: `tail -f logs/*.log`
- View health: `curl http://localhost:4002/health`
- Check documentation: http://localhost:4002/api-docs

Happy coding! 🚀

