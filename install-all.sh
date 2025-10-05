#!/bin/bash

# ========================================================
# Autopilot Monster - Complete Installation Script
# Installs all dependencies for all services
# ========================================================

set -e

echo "📦 Installing All Dependencies..."
echo "=================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

BASE_DIR="/Users/amitsaroj/Desktop/autopilot.monster"

# Install shared dependencies
print_status "Installing shared configuration dependencies..."
cd "$BASE_DIR/shared"
npm install --silent
print_success "Shared dependencies installed"

# Services to install
SERVICES=(
    "auth-service-node"
    "user-service-node"
    "marketplace-service-node"
    "cart-service-node"
    "order-service-node"
    "vendor-service-node"
    "content-service-node"
    "admin-service-node"
    "api-gateway-node"
)

# Install each service
for service in "${SERVICES[@]}"; do
    print_status "Installing $service..."
    cd "$BASE_DIR/services/$service"
    npm install --silent
    print_success "$service dependencies installed"
done

cd "$BASE_DIR"

echo ""
print_success "All dependencies installed successfully!"
echo ""
echo "📊 Services Ready:"
for service in "${SERVICES[@]}"; do
    echo "  ✅ $service"
done
echo ""
echo "🚀 Next: Start infrastructure with: docker-compose up -d"
echo "   Then: Start services with: ./start-all-services.sh"
echo ""

