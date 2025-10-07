# Production Deployment Guide - Autopilot Monster

## 🚀 Deployment Overview

This guide covers deploying Autopilot Monster to production environments with enterprise-grade security, scalability, and monitoring. The platform can be deployed using Docker Compose, Kubernetes, or cloud-native services.

## 📋 Prerequisites

### Infrastructure Requirements

| Component | Minimum | Recommended | Purpose |
|-----------|---------|-------------|---------|
| **CPU** | 8 cores | 16+ cores | Service processing |
| **RAM** | 16 GB | 32+ GB | Service memory |
| **Storage** | 100 GB SSD | 500 GB SSD | Databases & logs |
| **Network** | 1 Gbps | 10 Gbps | Traffic handling |

### Software Requirements

- **Docker**: 20.10+ with Docker Compose v2.0+
- **Kubernetes**: 1.24+ (optional, for K8s deployment)
- **Helm**: 3.0+ (optional, for K8s deployment)
- **SSL Certificate**: Valid SSL certificate for HTTPS
- **Domain**: Registered domain with DNS access

### Deployment Checklist

- [ ] Server provisioned and accessible via SSH
- [ ] Docker and Docker Compose installed
- [ ] Domain configured and DNS pointing to server
- [ ] SSL certificate obtained (Let's Encrypt or commercial)
- [ ] Environment variables prepared
- [ ] Database backups configured
- [ ] Monitoring tools installed
- [ ] Firewall rules configured

## 🐳 Docker Compose Deployment (Recommended)

### Architecture Overview

```
Production Stack:
├── Frontend (Next.js)       → Port 3000
├── API Gateway              → Port 4000
├── Auth Service             → Port 4002
├── Marketplace Service      → Port 4003
├── Order Service            → Port 4004
├── User Service             → Port 4005
├── Vendor Service           → Port 4006
├── Admin Service            → Port 4007
├── Content Service          → Port 4008
├── Cart Service             → Port 4009
├── MongoDB                  → Port 27017
├── Redis                    → Port 6379
├── Kafka                    → Port 9092
├── Zookeeper               → Port 2181
└── Elasticsearch           → Port 9200
```

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Clone Repository

```bash
# Clone project
git clone https://github.com/your-org/autopilot.monster.git
cd autopilot.monster

# Create necessary directories
mkdir -p logs data/mongodb data/redis data/kafka data/elasticsearch
```

### Step 3: Configure Environment

Create `.env.production`:

```env
# ===================================
# APPLICATION CONFIGURATION
# ===================================
NODE_ENV=production
APP_NAME=Autopilot Monster
APP_URL=https://autopilot.monster

# ===================================
# SERVICE PORTS
# ===================================
FRONTEND_PORT=3000
API_GATEWAY_PORT=4000
AUTH_SERVICE_PORT=4002
MARKETPLACE_SERVICE_PORT=4003
ORDER_SERVICE_PORT=4004
USER_SERVICE_PORT=4005
VENDOR_SERVICE_PORT=4006
ADMIN_SERVICE_PORT=4007
CONTENT_SERVICE_PORT=4008
CART_SERVICE_PORT=4009

# ===================================
# MONGODB CONFIGURATION
# ===================================
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=Change_This_Super_Secure_Password_123!
MONGODB_HOST=mongodb
MONGODB_PORT=27017

# Database URLs (internal Docker network)
AUTH_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/auth_db?authSource=admin
USER_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/user_db?authSource=admin
MARKETPLACE_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/marketplace_db?authSource=admin
CART_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/cart_db?authSource=admin
ORDER_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/order_db?authSource=admin
VENDOR_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/vendor_db?authSource=admin
CONTENT_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/content_db?authSource=admin
ADMIN_DB_URL=mongodb://admin:Change_This_Super_Secure_Password_123!@mongodb:27017/admin_db?authSource=admin

# ===================================
# REDIS CONFIGURATION
# ===================================
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=Change_This_Redis_Password_456!

# ===================================
# KAFKA CONFIGURATION
# ===================================
KAFKA_BROKERS=kafka:29092
KAFKA_CLIENT_ID=autopilot-monster
ZOOKEEPER_HOST=zookeeper:2181

# ===================================
# ELASTICSEARCH CONFIGURATION
# ===================================
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_NODE=http://elasticsearch:9200

# ===================================
# JWT CONFIGURATION
# ===================================
JWT_SECRET=Change_This_To_A_Super_Secure_Random_String_Min_32_Chars!
JWT_REFRESH_SECRET=Change_This_To_Another_Super_Secure_Random_String_Min_32!
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# ===================================
# PAYMENT CONFIGURATION
# ===================================
# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ===================================
# FRONTEND CONFIGURATION
# ===================================
NEXT_PUBLIC_API_URL=https://api.autopilot.monster
NEXT_PUBLIC_APP_URL=https://autopilot.monster
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here

# ===================================
# EMAIL CONFIGURATION (Optional)
# ===================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@autopilot.monster

# ===================================
# AWS S3 / CLOUDFLARE R2 (Optional)
# ===================================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=autopilot-monster-assets

# ===================================
# SECURITY
# ===================================
CORS_ORIGINS=https://autopilot.monster,https://www.autopilot.monster
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15m

# ===================================
# MONITORING (Optional)
# ===================================
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOG_LEVEL=info
```

### Step 4: Configure Production Docker Compose

The `docker-compose.prod.yml` is already configured. Review it:

```bash
cat docker-compose.prod.yml
```

Key sections:

```yaml
# Frontend
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
    - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# API Gateway
api-gateway:
  build:
    context: ./services/api-gateway-node
  ports:
    - "4000:4000"
  environment:
    - NODE_ENV=production
    
# All 8 microservices...
# MongoDB, Redis, Kafka, Elasticsearch...
```

### Step 5: Build and Deploy

```bash
# Load environment variables
export $(cat .env.production | xargs)

# Build all Docker images
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Verify services are running
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 6: Verify Deployment

```bash
# Check health endpoints
curl http://localhost:4000/health
curl http://localhost:4002/health  # Auth service
curl http://localhost:4003/health  # Marketplace service

# Test API
curl http://localhost:4000/api/marketplace/products

# Check frontend
curl http://localhost:3000
```

### Step 7: Configure Nginx Reverse Proxy

Install Nginx:

```bash
sudo apt install nginx -y
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/autopilot-monster
```

```nginx
# API Server
    server {
        listen 80;
        server_name api.autopilot.monster;

    # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.autopilot.monster;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.autopilot.monster/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.autopilot.monster/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API Gateway proxy
        location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;
    }

    # Frontend
    server {
        listen 80;
        server_name autopilot.monster www.autopilot.monster;

        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name autopilot.monster www.autopilot.monster;

    ssl_certificate /etc/letsencrypt/live/autopilot.monster/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/autopilot.monster/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend proxy
        location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/autopilot-monster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Configure SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificates
sudo certbot --nginx -d autopilot.monster -d www.autopilot.monster
sudo certbot --nginx -d api.autopilot.monster

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 9: Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block direct access to services (only via Nginx)
sudo ufw deny 3000
sudo ufw deny 4000
sudo ufw deny 4002:4009/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

## 📊 Monitoring & Logging

### Step 1: Configure Log Rotation

```bash
sudo nano /etc/logrotate.d/autopilot-monster
```

```
/var/www/autopilot.monster/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        docker-compose -f /var/www/autopilot.monster/docker-compose.prod.yml restart
    endscript
}
```

### Step 2: Set Up Health Monitoring

Create monitoring script:

```bash
nano /usr/local/bin/monitor-autopilot.sh
```

```bash
#!/bin/bash

API_URL="http://localhost:4000/health"
ALERT_EMAIL="admin@autopilot.monster"

response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $response != "200" ]; then
    echo "ALERT: Autopilot Monster API is down!" | mail -s "API Alert" $ALERT_EMAIL
    
    # Restart services
    cd /var/www/autopilot.monster
    docker-compose -f docker-compose.prod.yml restart
fi
```

Add to crontab:

```bash
chmod +x /usr/local/bin/monitor-autopilot.sh
crontab -e
```

```
*/5 * * * * /usr/local/bin/monitor-autopilot.sh
```

### Step 3: Database Backups

Create backup script:

```bash
nano /usr/local/bin/backup-mongodb.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/autopilot-monster"
DATE=$(date +%Y%m%d_%H%M%S)
MONGO_CONTAINER="autopilot-mongodb"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup all databases
docker exec $MONGO_CONTAINER mongodump \
    --username admin \
    --password Change_This_Super_Secure_Password_123! \
    --authenticationDatabase admin \
    --out /tmp/backup

# Copy from container
docker cp $MONGO_CONTAINER:/tmp/backup $BACKUP_DIR/backup_$DATE

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

Schedule daily backups:

```bash
chmod +x /usr/local/bin/backup-mongodb.sh
crontab -e
```

```
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

## 🔒 Security Best Practices

### 1. Environment Variables Security

```bash
# Secure .env file
chmod 600 .env.production
chown root:root .env.production
```

### 2. Docker Security

```bash
# Run Docker rootless mode (optional)
dockerd-rootless-setuptool.sh install

# Limit container resources
# Add to docker-compose.prod.yml
services:
  auth-service:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

### 3. MongoDB Security

```javascript
// Connect to MongoDB and create user accounts
docker exec -it autopilot-mongodb mongosh -u admin -p password123

// Create service-specific users
use auth_db
db.createUser({
  user: "auth_service",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "auth_db" }]
})
```

### 4. Redis Security

```bash
# Enable password authentication (already in docker-compose.prod.yml)
# Additional: Disable dangerous commands
docker exec -it autopilot-redis redis-cli
> CONFIG SET rename-command FLUSHDB ""
> CONFIG SET rename-command FLUSHALL ""
> CONFIG SET rename-command CONFIG ""
```

## 🚀 Scaling

### Horizontal Scaling with Docker

```bash
# Scale specific services
docker-compose -f docker-compose.prod.yml up -d --scale marketplace-service=3
docker-compose -f docker-compose.prod.yml up -d --scale order-service=2

# Update Nginx to load balance
upstream marketplace_backend {
    server localhost:4003;
    server localhost:4013;
    server localhost:4023;
}
```

### Database Scaling

**Read Replicas**:
```yaml
# docker-compose.prod.yml
mongodb-replica:
  image: mongo:7.0
  command: --replSet rs0
  depends_on:
    - mongodb
```

**Connection Pooling**:
```typescript
mongoose.connect(uri, {
  maxPoolSize: 50,
  minPoolSize: 10
});
```

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild specific service
docker-compose -f docker-compose.prod.yml build auth-service

# Restart without downtime
docker-compose -f docker-compose.prod.yml up -d --no-deps auth-service
```

### Database Migration

```bash
# Backup before migration
/usr/local/bin/backup-mongodb.sh

# Run migration
docker exec -it autopilot-auth-service npm run migrate
```

## 📈 Performance Tuning

### MongoDB Optimization

```javascript
// Create indexes
db.products.createIndex({ vendorId: 1, status: 1 });
db.products.createIndex({ category: 1, price: 1 });
db.orders.createIndex({ userId: 1, createdAt: -1 });
```

### Redis Optimization

```bash
# Increase max memory
docker exec -it autopilot-redis redis-cli CONFIG SET maxmemory 2gb
docker exec -it autopilot-redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Node.js Optimization

```bash
# Set NODE_ENV
export NODE_ENV=production

# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096"
```

## 🆘 Troubleshooting

### Service Won't Start

   ```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs auth-service

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Restart service
docker-compose -f docker-compose.prod.yml restart auth-service
```

### Database Connection Issues

   ```bash
# Test MongoDB connection
docker exec -it autopilot-mongodb mongosh -u admin -p password123

# Check network
docker network inspect autopilot-network
```

### High CPU Usage

```bash
# Monitor resources
docker stats

# Identify problematic service
htop
```

## 📚 Related Documentation

- [Technical Architecture](./technical-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [Setup Guide](./SETUP.md)
- [API Reference](./API_REFERENCE.md)
- [Project Status](../PROJECT_STATUS.md)

---

<div align="center">

**[⬆ Back to Top](#production-deployment-guide---autopilot-monster)**

Made with ❤️ by the Autopilot Monster Team

</div>
