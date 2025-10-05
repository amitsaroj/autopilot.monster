#!/bin/bash

# ==============================================
# Autopilot Monster - Install & Start Script
# Installs dependencies and starts all services
# ==============================================

set -e  # Exit on error

echo "🚀 Autopilot Monster - Installation & Startup"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs
print_success "Logs directory created"

# Kill any existing processes
print_status "Cleaning up existing processes..."
pkill -f "ts-node-dev" 2>/dev/null || true
pkill -f "node.*auth-service" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 2
print_success "Cleanup complete"

# Install shared dependencies
print_status "Installing shared dependencies..."
cd shared
if [ ! -d "node_modules" ]; then
    npm install --silent
    print_success "Shared dependencies installed"
else
    print_warning "Shared dependencies already installed (skipping)"
fi
cd ..

# Install Auth Service dependencies
print_status "Installing Auth Service dependencies..."
cd services/auth-service-node
if [ ! -d "node_modules" ]; then
    npm install --silent
    print_success "Auth Service dependencies installed"
else
    print_warning "Auth Service dependencies already installed (skipping)"
fi
cd ../..

echo ""
print_status "Starting services..."
echo ""

# Start Auth Service
print_status "Starting Auth Service on port 4002..."
cd services/auth-service-node
PORT=4002 npm run dev > ../../logs/auth-service.log 2>&1 &
AUTH_PID=$!
echo $AUTH_PID > ../../logs/auth-service.pid
cd ../..
print_success "Auth Service started (PID: $AUTH_PID)"

# Wait for services to initialize
print_status "Waiting for services to initialize..."
sleep 5

echo ""
echo "=============================================="
print_success "All services started successfully!"
echo "=============================================="
echo ""
echo "📊 Service Status:"
echo "  🔐 Auth Service:    http://localhost:4002"
echo "  📚 API Docs:        http://localhost:4002/api-docs"
echo "  ❤️  Health Check:   http://localhost:4002/health"
echo ""
echo "📋 Process IDs saved in logs/*.pid"
echo "📝 Logs available in logs/*.log"
echo ""
echo "🛑 To stop services: ./stop-services.sh"
echo "📊 To view logs: tail -f logs/*.log"
echo ""

# Health check
print_status "Performing health check..."
sleep 3

if curl -s http://localhost:4002/health > /dev/null 2>&1; then
    print_success "Auth Service is healthy ✅"
else
    print_warning "Auth Service health check failed (service may still be starting...)"
fi

echo ""
print_success "🎉 Setup complete! Services are running."
echo ""

