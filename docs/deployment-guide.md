# Autopilot.Monster - Production Deployment Guide

## 🚀 Production Deployment Overview

This guide covers deploying Autopilot.Monster to production environments with enterprise-grade security, scalability, and monitoring.

## 📋 Prerequisites

### Infrastructure Requirements
- **CPU**: 8+ cores per service
- **RAM**: 16GB+ per service
- **Storage**: 100GB+ SSD per service
- **Network**: 1Gbps+ bandwidth
- **Load Balancer**: NGINX or AWS ALB
- **SSL Certificate**: Valid SSL certificate

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Kubernetes 1.24+ (for K8s deployment)
- Helm 3.0+ (for K8s deployment)

## 🐳 Docker Deployment

### 1. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # Load Balancer
  nginx:
    image: nginx:alpine
    container_name: autopilot-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - api-gateway
    networks:
      - autopilot-network

  # Databases
  mongodb:
    image: mongo:7.0
    container_name: autopilot-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: autopilot
    volumes:
      - mongodb_data:/data/db
      - ./infrastructure/mongodb/init:/docker-entrypoint-initdb.d
    networks:
      - autopilot-network

  redis:
    image: redis:7.2-alpine
    container_name: autopilot-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - autopilot-network

  # Message Brokers
  kafka:
    image: confluentinc/cp-kafka:7.4.0
    container_name: autopilot-kafka
    restart: unless-stopped
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    volumes:
      - kafka_data:/var/lib/kafka/data
    networks:
      - autopilot-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: autopilot-elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - autopilot-network

  # Services
  api-gateway:
    build:
      context: ./services/api-gateway
      dockerfile: Dockerfile.prod
    container_name: autopilot-api-gateway
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3001
      - MONGODB_URI=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/autopilot?authSource=admin
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
      - redis
      - kafka
    networks:
      - autopilot-network

  auth-service:
    build:
      context: ./services/auth-service
      dockerfile: Dockerfile.prod
    container_name: autopilot-auth-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3002
      - MONGODB_URI=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/autopilot_auth?authSource=admin
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
      - redis
    networks:
      - autopilot-network

  # Add other services...

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: autopilot-frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.autopilot.monster
    depends_on:
      - api-gateway
    networks:
      - autopilot-network

volumes:
  mongodb_data:
  redis_data:
  kafka_data:
  elasticsearch_data:

networks:
  autopilot-network:
    driver: bridge
```

### 2. Production Environment Variables

Create `.env.prod`:

```bash
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRATION=24h

# Payment
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
RAZORPAY_KEY_ID=rzp_live_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@autopilot.monster

# AWS (for file storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=autopilot-assets

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### 3. NGINX Configuration

Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:3001;
    }

    upstream frontend {
        server frontend:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API Gateway
    server {
        listen 80;
        server_name api.autopilot.monster;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.autopilot.monster;

        ssl_certificate /etc/ssl/certs/api.autopilot.monster.crt;
        ssl_certificate_key /etc/ssl/certs/api.autopilot.monster.key;

        location / {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/v1/auth/ {
            limit_req zone=auth burst=10 nodelay;
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
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

        ssl_certificate /etc/ssl/certs/autopilot.monster.crt;
        ssl_certificate_key /etc/ssl/certs/autopilot.monster.key;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 4. Production Dockerfiles

Create `Dockerfile.prod` for each service:

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "run", "start:prod"]
```

## ☸️ Kubernetes Deployment

### 1. Namespace and ConfigMap

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: autopilot-monster

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: autopilot-config
  namespace: autopilot-monster
data:
  NODE_ENV: "production"
  PORT: "3000"
  MONGODB_URI: "mongodb://mongodb:27017/autopilot"
  REDIS_URL: "redis://redis:6379"
```

### 2. Secrets

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: autopilot-secrets
  namespace: autopilot-monster
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
  MONGO_PASSWORD: <base64-encoded-password>
  REDIS_PASSWORD: <base64-encoded-password>
  STRIPE_SECRET_KEY: <base64-encoded-key>
```

### 3. Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: autopilot-monster
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: autopilot/api-gateway:latest
        ports:
        - containerPort: 3001
        envFrom:
        - configMapRef:
            name: autopilot-config
        - secretRef:
            name: autopilot-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4. Service

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: autopilot-monster
spec:
  selector:
    app: api-gateway
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: ClusterIP
```

### 5. Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: autopilot-ingress
  namespace: autopilot-monster
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.autopilot.monster
    secretName: api-tls
  - hosts:
    - autopilot.monster
    secretName: frontend-tls
  rules:
  - host: api.autopilot.monster
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 80
  - host: autopilot.monster
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup

```bash
# Generate SSL certificates with Let's Encrypt
certbot certonly --nginx -d autopilot.monster -d www.autopilot.monster -d api.autopilot.monster
```

### 2. Firewall Configuration

```bash
# UFW configuration
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3. Security Headers

Add to your application:

```typescript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 📊 Monitoring & Logging

### 1. Prometheus Configuration

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'autopilot-services'
    static_configs:
      - targets: ['api-gateway:3001', 'auth-service:3002', 'catalog-service:3003']
    metrics_path: /metrics
    scrape_interval: 5s
```

### 2. Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Autopilot.Monster Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{service}}"
          }
        ]
      }
    ]
  }
}
```

### 3. Log Aggregation

```yaml
# logging/fluentd.conf
<source>
  @type tail
  path /var/log/containers/*autopilot*.log
  pos_file /var/log/fluentd-containers.log.pos
  tag kubernetes.*
  format json
</source>

<match kubernetes.**>
  @type elasticsearch
  host elasticsearch.logging.svc.cluster.local
  port 9200
  index_name autopilot-logs
</match>
```

## 🚀 Deployment Commands

### Docker Compose Deployment

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale api-gateway=3

# View logs
docker-compose -f docker-compose.prod.yml logs -f api-gateway

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n autopilot-monster

# Scale deployment
kubectl scale deployment api-gateway --replicas=5 -n autopilot-monster

# View logs
kubectl logs -f deployment/api-gateway -n autopilot-monster

# Update deployment
kubectl set image deployment/api-gateway api-gateway=autopilot/api-gateway:v2.0.0 -n autopilot-monster
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker images
      run: |
        docker build -t autopilot/api-gateway:${{ github.sha }} ./services/api-gateway
        docker push autopilot/api-gateway:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/api-gateway api-gateway=autopilot/api-gateway:${{ github.sha }} -n autopilot-monster
        kubectl rollout status deployment/api-gateway -n autopilot-monster
```

## 📈 Performance Optimization

### 1. Database Optimization

```javascript
// MongoDB indexes
db.products.createIndex({ "name": "text", "description": "text" })
db.products.createIndex({ "category": 1, "price": 1 })
db.orders.createIndex({ "userId": 1, "createdAt": -1 })
```

### 2. Redis Caching

```typescript
// Cache frequently accessed data
@Cacheable('products', 300) // 5 minutes
async getProducts(query: ProductQueryDto) {
  return this.productService.findAll(query);
}
```

### 3. CDN Configuration

```nginx
# NGINX CDN configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}
```

## 🆘 Troubleshooting

### Common Issues

1. **Service not starting**
   ```bash
   docker logs autopilot-api-gateway
   kubectl describe pod api-gateway-xxx -n autopilot-monster
   ```

2. **Database connection issues**
   ```bash
   docker exec -it autopilot-mongodb mongo
   kubectl exec -it mongodb-xxx -n autopilot-monster -- mongo
   ```

3. **Memory issues**
   ```bash
   docker stats
   kubectl top pods -n autopilot-monster
   ```

### Health Checks

```bash
# Check service health
curl https://api.autopilot.monster/health

# Check database connectivity
curl https://api.autopilot.monster/health/db

# Check external services
curl https://api.autopilot.monster/health/external
```

## 📞 Support

For deployment issues:
- Check logs: `docker-compose logs -f [service-name]`
- Monitor metrics: Grafana dashboard
- Review documentation: [docs.autopilot.monster](https://docs.autopilot.monster)
- Contact support: support@autopilot.monster

---

**Production deployment completed successfully! 🎉**
