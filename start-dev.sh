#!/bin/bash

# Autopilot.Monster Development Startup Script
echo "🚀 Starting Autopilot.Monster Development Environment..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "node dist/main.js" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

# Set environment variables
export NODE_ENV=development
export MONGODB_URI=mongodb://localhost:27017/autopilot_dev
export REDIS_HOST=localhost
export REDIS_PORT=6379
export JWT_SECRET=dev-secret-key-change-in-production
export JWT_EXPIRES_IN=1h

echo "📦 Starting Services..."

# Start API Gateway (Port 4000)
echo "🌐 Starting API Gateway on port 4000..."
cd services/api-gateway
PORT=4000 npm run start:dev > ../../logs/api-gateway.log 2>&1 &
API_GATEWAY_PID=$!
cd ../..

# Start Auth Service (Port 3002)
echo "🔐 Starting Auth Service on port 3002..."
cd services/auth-service
PORT=3002 npm run start:dev > ../../logs/auth-service.log 2>&1 &
AUTH_SERVICE_PID=$!
cd ../..

# Start Catalog Service (Port 3003)
echo "📚 Starting Catalog Service on port 3003..."
cd services/catalog-service
PORT=3003 npm run start:dev > ../../logs/catalog-service.log 2>&1 &
CATALOG_SERVICE_PID=$!
cd ../..

# Start Payment Service (Port 3004)
echo "💳 Starting Payment Service on port 3004..."
cd services/payment-service
PORT=3004 npm run start:dev > ../../logs/payment-service.log 2>&1 &
PAYMENT_SERVICE_PID=$!
cd ../..

# Start User Service (Port 3005)
echo "👤 Starting User Service on port 3005..."
cd services/user-service
PORT=3005 npm run start:dev > ../../logs/user-service.log 2>&1 &
USER_SERVICE_PID=$!
cd ../..

# Start Vendor Service (Port 3006)
echo "🏪 Starting Vendor Service on port 3006..."
cd services/vendor-service
PORT=3006 npm run start:dev > ../../logs/vendor-service.log 2>&1 &
VENDOR_SERVICE_PID=$!
cd ../..

# Start Admin Service (Port 3007)
echo "👑 Starting Admin Service on port 3007..."
cd services/admin-service
PORT=3007 npm run start:dev > ../../logs/admin-service.log 2>&1 &
ADMIN_SERVICE_PID=$!
cd ../..

# Start Content Service (Port 3008)
echo "📝 Starting Content Service on port 3008..."
cd services/content-service
PORT=3008 npm run start:dev > ../../logs/content-service.log 2>&1 &
CONTENT_SERVICE_PID=$!
cd ../..

# Start Frontend (Port 3000)
echo "🎨 Starting Frontend on port 3000..."
cd frontend
PORT=3000 npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Display service status
echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📊 Service Status:"
echo "=================="
echo "🌐 API Gateway:    http://localhost:4000"
echo "📚 API Docs:       http://localhost:4000/api-docs"
echo "🎨 Frontend:       http://localhost:3000"
echo "🔐 Auth Service:   http://localhost:3002/health"
echo "📚 Catalog Service: http://localhost:3003/health"
echo "💳 Payment Service: http://localhost:3004/health"
echo "👤 User Service:   http://localhost:3005/health"
echo "🏪 Vendor Service: http://localhost:3006/health"
echo "👑 Admin Service:  http://localhost:3007/health"
echo "📝 Content Service: http://localhost:3008/health"
echo ""
echo "📋 Process IDs:"
echo "==============="
echo "API Gateway PID: $API_GATEWAY_PID"
echo "Auth Service PID: $AUTH_SERVICE_PID"
echo "Catalog Service PID: $CATALOG_SERVICE_PID"
echo "Payment Service PID: $PAYMENT_SERVICE_PID"
echo "User Service PID: $USER_SERVICE_PID"
echo "Vendor Service PID: $VENDOR_SERVICE_PID"
echo "Admin Service PID: $ADMIN_SERVICE_PID"
echo "Content Service PID: $CONTENT_SERVICE_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Logs are available in the 'logs' directory"
echo "🛑 To stop all services, run: ./stop-dev.sh"
echo ""
echo "🚀 Development environment is ready!"

# Save PIDs for cleanup
echo "$API_GATEWAY_PID" > logs/api-gateway.pid
echo "$AUTH_SERVICE_PID" > logs/auth-service.pid
echo "$CATALOG_SERVICE_PID" > logs/catalog-service.pid
echo "$PAYMENT_SERVICE_PID" > logs/payment-service.pid
echo "$USER_SERVICE_PID" > logs/user-service.pid
echo "$VENDOR_SERVICE_PID" > logs/vendor-service.pid
echo "$ADMIN_SERVICE_PID" > logs/admin-service.pid
echo "$CONTENT_SERVICE_PID" > logs/content-service.pid
echo "$FRONTEND_PID" > logs/frontend.pid

echo "💡 Tip: Check logs with: tail -f logs/*.log"
