#!/bin/bash

# ========================================================
# Start Everything - Complete System Startup
# Starts all backend services + frontend
# ========================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_header "🚀 Starting Autopilot.Monster Complete System"

echo ""
print_info "This will start:"
print_info "  • Infrastructure (MongoDB, Redis, Kafka)"
print_info "  • 8 Backend Microservices"
print_info "  • API Gateway"
print_info "  • Frontend (Next.js)"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

print_success "Docker is running"

# Step 1: Start Infrastructure
print_header "📦 Starting Infrastructure Services"

print_info "Starting MongoDB, Redis, Kafka, Zookeeper..."
docker-compose up -d mongodb redis kafka zookeeper elasticsearch

sleep 5
print_success "Infrastructure services started"

# Step 2: Install Dependencies (if needed)
print_header "📦 Checking Dependencies"

if [ ! -d "shared/node_modules" ] || [ ! -d "services/auth-service-node/node_modules" ]; then
    print_info "Installing dependencies..."
    ./install-all.sh
else
    print_success "Dependencies already installed"
fi

# Step 3: Start Backend Services
print_header "🔧 Starting Backend Services"

print_info "Starting all 8 microservices..."
./start-all-services.sh &

sleep 10
print_success "Backend services starting..."

# Step 4: Start Frontend
print_header "🎨 Starting Frontend"

print_info "Starting Next.js frontend on port 3000..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 5
print_success "Frontend starting..."

# Step 5: Wait for services to be ready
print_header "⏳ Waiting for Services"

print_info "Waiting for API Gateway..."
for i in {1..30}; do
    if curl -s http://localhost:4000/health > /dev/null 2>&1; then
        print_success "API Gateway is ready!"
        break
    fi
    sleep 2
done

print_info "Waiting for Frontend..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is ready!"
        break
    fi
    sleep 2
done

# Summary
print_header "✨ System Started Successfully!"

echo ""
print_success "All services are running!"
echo ""
echo -e "${GREEN}🌐 Access Points:${NC}"
echo "  • Frontend:       http://localhost:3000"
echo "  • API Gateway:    http://localhost:4000"
echo "  • API Docs:       http://localhost:4000/api-docs"
echo ""
echo -e "${GREEN}🔧 Backend Services:${NC}"
echo "  • Auth Service:       http://localhost:4002"
echo "  • User Service:       http://localhost:4005"
echo "  • Marketplace:        http://localhost:4003"
echo "  • Cart Service:       http://localhost:4009"
echo "  • Order Service:      http://localhost:4004"
echo "  • Vendor Service:     http://localhost:4006"
echo "  • Content Service:    http://localhost:4008"
echo "  • Admin Service:      http://localhost:4007"
echo ""
echo -e "${YELLOW}📊 Monitoring:${NC}"
echo "  • View logs: tail -f logs/*.log"
echo "  • Docker logs: docker-compose logs -f"
echo "  • Stop all: ./stop-everything.sh"
echo ""
print_info "System is ready for testing!"
echo ""
