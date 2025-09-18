#!/bin/bash

# Autopilot.Monster Development Startup Script
echo "🚀 Starting Autopilot.Monster Development Environment..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "node dist/main.js" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

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

# Start API Gateway (Port 3000)
echo "🌐 Starting API Gateway on port 3000..."
cd services/api-gateway
npm run start:dev > ../../logs/api-gateway.log 2>&1 &
API_GATEWAY_PID=$!
cd ../..

# Start Auth Service (Port 3002)
echo "🔐 Starting Auth Service on port 3002..."
cd services/auth-service
PORT=3002 node dist/main.js > ../../logs/auth-service.log 2>&1 &
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

# Start Frontend (Port 3001)
echo "🎨 Starting Frontend on port 3001..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

check_service() {
    local name=$1
    local port=$2
    local url="http://localhost:$port/health"
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo "✅ $name is healthy on port $port"
        return 0
    else
        echo "❌ $name is not responding on port $port"
        return 1
    fi
}

# Check each service
check_service "API Gateway" 3000
check_service "Auth Service" 3002
check_service "Catalog Service" 3003
check_service "Payment Service" 3004
check_service "User Service" 3005
check_service "Vendor Service" 3006

# Check frontend
if curl -s "http://localhost:3001" > /dev/null 2>&1; then
    echo "✅ Frontend is running on port 3001"
else
    echo "❌ Frontend is not responding on port 3001"
fi

echo ""
echo "🎉 Development environment started!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend:        http://localhost:3001"
echo "   API Gateway:     http://localhost:3000"
echo "   Auth Service:    http://localhost:3002"
echo "   Catalog Service: http://localhost:3003"
echo "   Payment Service: http://localhost:3004"
echo "   User Service:    http://localhost:3005"
echo "   Vendor Service:  http://localhost:3006"
echo ""
echo "📊 API Documentation: http://localhost:3000/api-docs"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo ""
echo "🛑 To stop all services, run: ./stop-dev.sh"
echo ""

# Save PIDs for cleanup
echo "$API_GATEWAY_PID" > logs/api-gateway.pid
echo "$AUTH_SERVICE_PID" > logs/auth-service.pid
echo "$CATALOG_SERVICE_PID" > logs/catalog-service.pid
echo "$PAYMENT_SERVICE_PID" > logs/payment-service.pid
echo "$USER_SERVICE_PID" > logs/user-service.pid
echo "$VENDOR_SERVICE_PID" > logs/vendor-service.pid
echo "$FRONTEND_PID" > logs/frontend.pid

echo "💡 Tip: Check logs with: tail -f logs/*.log"
