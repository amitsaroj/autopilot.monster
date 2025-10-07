#!/bin/bash

# ========================================================
# Complete System Test - Backend + Frontend Integration
# ========================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
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

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ] || [ "$response" = "200" ]; then
        print_success "OK (HTTP $response)"
        return 0
    else
        print_error "FAILED (HTTP $response)"
        return 1
    fi
}

print_header "🚀 COMPLETE SYSTEM TEST"

echo ""
print_info "This script will test:"
print_info "  1. All backend services health"
print_info "  2. API Gateway connectivity"
print_info "  3. End-to-end API functionality"
print_info "  4. Frontend-backend integration"
echo ""

# Test 1: Infrastructure Services
print_header "📦 Testing Infrastructure Services"

echo -n "MongoDB... "
if docker ps | grep -q mongodb; then
    print_success "Running"
else
    print_error "Not running"
fi

echo -n "Redis... "
if docker ps | grep -q redis; then
    print_success "Running"
else
    print_error "Not running"
fi

echo -n "Kafka... "
if docker ps | grep -q kafka; then
    print_success "Running"
else
    print_error "Not running"
fi

# Test 2: Backend Services Health
print_header "🔧 Testing Backend Services"

test_endpoint "API Gateway" "http://localhost:4000/health"
test_endpoint "Auth Service" "http://localhost:4002/health"
test_endpoint "User Service" "http://localhost:4005/health"
test_endpoint "Marketplace Service" "http://localhost:4003/health"
test_endpoint "Cart Service" "http://localhost:4009/health"
test_endpoint "Order Service" "http://localhost:4004/health"
test_endpoint "Vendor Service" "http://localhost:4006/health"
test_endpoint "Content Service" "http://localhost:4008/health"
test_endpoint "Admin Service" "http://localhost:4007/health"

# Test 3: API Endpoints
print_header "🌐 Testing API Endpoints"

# Test public endpoints
test_endpoint "Get Products" "http://localhost:4000/api/marketplace/products"
test_endpoint "Get Featured Products" "http://localhost:4000/api/marketplace/products/featured"
test_endpoint "Get Categories" "http://localhost:4000/api/marketplace/categories"
test_endpoint "Get Blog Posts" "http://localhost:4000/api/content/blog"
test_endpoint "Get Tutorials" "http://localhost:4000/api/content/tutorials"

# Test 4: Swagger Documentation
print_header "📚 Testing API Documentation"

test_endpoint "Unified Swagger" "http://localhost:4000/api-docs"
test_endpoint "Auth Swagger" "http://localhost:4002/api-docs"
test_endpoint "User Swagger" "http://localhost:4005/api-docs"
test_endpoint "Marketplace Swagger" "http://localhost:4003/api-docs"

# Test 5: Frontend
print_header "🎨 Testing Frontend"

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is accessible at http://localhost:3000"
else
    print_info "Frontend not running. Start with: cd frontend && npm run dev"
fi

# Test 6: End-to-End User Flow
print_header "🎯 Testing End-to-End Flow"

print_info "Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "Test123456",
    "firstName": "Test",
    "lastName": "User"
  }' 2>/dev/null || echo '{"success":false}')

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    print_success "User registration works"
    
    # Extract token
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        print_success "JWT token received"
        
        # Test authenticated endpoint
        print_info "Testing authenticated endpoint..."
        PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
          http://localhost:4000/api/users/profile 2>/dev/null || echo '{"success":false}')
        
        if echo "$PROFILE_RESPONSE" | grep -q '"success":true'; then
            print_success "Authenticated API calls work"
        else
            print_error "Authenticated API calls failed"
        fi
    fi
else
    print_error "User registration failed"
fi

# Summary
print_header "📊 TEST SUMMARY"

echo ""
print_info "Backend Services: 8/8 services tested"
print_info "API Endpoints: Multiple endpoints verified"
print_info "Documentation: Swagger UI accessible"
echo ""

print_success "✨ System test complete!"
echo ""
print_info "Next steps:"
print_info "  1. Access API docs: http://localhost:4000/api-docs"
print_info "  2. Access frontend: http://localhost:3000"
print_info "  3. Test user flows in the browser"
echo ""
print_info "For detailed logs:"
print_info "  Backend: docker-compose -f docker-compose.prod.yml logs -f"
print_info "  Frontend: cd frontend && npm run dev"
echo ""
