#!/bin/bash

# ========================================================
# Stop Everything - Complete System Shutdown
# ========================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
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

print_header "🛑 Stopping Autopilot.Monster Complete System"

# Stop backend services
echo "Stopping backend services..."
./stop-all-services.sh 2>/dev/null || true
print_success "Backend services stopped"

# Stop frontend
echo "Stopping frontend..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
print_success "Frontend stopped"

# Stop Docker infrastructure
echo "Stopping infrastructure..."
docker-compose down 2>/dev/null || true
print_success "Infrastructure stopped"

print_header "✨ System Stopped"

echo ""
print_success "All services have been stopped"
echo ""
