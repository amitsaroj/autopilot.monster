#!/bin/bash

# ========================================================
# Autopilot Monster - Start All Services Script
# ========================================================

set -e

echo "🚀 Starting All Microservices..."
echo "================================"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create logs directory
mkdir -p logs

# Kill existing processes
print_status "Cleaning up existing processes..."
pkill -f "ts-node-dev" 2>/dev/null || true
pkill -f "node dist/index.js" 2>/dev/null || true
sleep 2

BASE_DIR="/Users/amitsaroj/Desktop/autopilot.monster"

# Start services with their ports
declare -A SERVICES=(
    ["auth-service-node"]="4002"
    ["user-service-node"]="4005"
    ["marketplace-service-node"]="4003"
    ["cart-service-node"]="4009"
    ["order-service-node"]="4004"
    ["vendor-service-node"]="4006"
    ["content-service-node"]="4008"
    ["admin-service-node"]="4007"
)

# Start microservices
for service in "${!SERVICES[@]}"; do
    port="${SERVICES[$service]}"
    print_status "Starting $service on port $port..."
    cd "$BASE_DIR/services/$service"
    npm run dev > "$BASE_DIR/logs/$service.log" 2>&1 &
    pid=$!
    echo $pid > "$BASE_DIR/logs/$service.pid"
    print_success "$service started (PID: $pid)"
    cd "$BASE_DIR"
done

# Wait for services to initialize
print_status "Waiting for services to initialize..."
sleep 10

# Start API Gateway last
print_status "Starting API Gateway on port 4000..."
cd "$BASE_DIR/services/api-gateway-node"
npm run dev > "$BASE_DIR/logs/api-gateway.log" 2>&1 &
GATEWAY_PID=$!
echo $GATEWAY_PID > "$BASE_DIR/logs/api-gateway.pid"
print_success "API Gateway started (PID: $GATEWAY_PID)"
cd "$BASE_DIR"

# Wait for gateway
sleep 5

echo ""
echo "========================================"
print_success "All Services Started Successfully!"
echo "========================================"
echo ""
echo "🌐 API Gateway:      http://localhost:4000"
echo "📚 Unified Docs:     http://localhost:4000/api-docs"
echo "❤️  Health Check:    http://localhost:4000/health"
echo ""
echo "📊 Microservices:"
echo "   🔐 Auth:          http://localhost:4002"
echo "   👤 User:          http://localhost:4005"
echo "   🛍️  Marketplace:   http://localhost:4003"
echo "   🛒 Cart:          http://localhost:4009"
echo "   📦 Orders:        http://localhost:4004"
echo "   🏪 Vendor:        http://localhost:4006"
echo "   📝 Content:       http://localhost:4008"
echo "   👑 Admin:         http://localhost:4007"
echo ""
echo "📋 Process IDs saved in logs/*.pid"
echo "📝 Logs available in logs/*.log"
echo ""
echo "🛑 To stop: ./stop-all-services.sh"
echo "📊 View logs: tail -f logs/*.log"
echo ""

# Health check
print_status "Performing health checks..."
sleep 3

if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    print_success "API Gateway is healthy ✅"
else
    print_warning "API Gateway health check failed (may still be starting...)"
fi

echo ""
print_success "🎉 All services are running!"
