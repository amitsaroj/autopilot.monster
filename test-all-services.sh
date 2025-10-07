#!/bin/bash

# ========================================================
# Autopilot Monster - Test All Services
# Comprehensive testing script for all microservices
# ========================================================

set -e

echo "🧪 Testing All Microservices..."
echo "================================"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Service definitions: name|port
SERVICES=(
    "API Gateway|4000"
    "Auth Service|4002"
    "User Service|4005"
    "Marketplace Service|4003"
    "Cart Service|4009"
    "Order Service|4004"
    "Vendor Service|4006"
    "Content Service|4008"
    "Admin Service|4007"
)

passed=0
failed=0
total=${#SERVICES[@]}

echo "📊 Testing ${total} microservices..."
echo ""

# Test each service
for service_def in "${SERVICES[@]}"; do
    IFS='|' read -r name port <<< "$service_def"
    
    print_status "Testing $name on port $port..."
    
    # Test health endpoint
    if curl -s -f "http://localhost:$port/health" > /dev/null 2>&1; then
        response=$(curl -s "http://localhost:$port/health")
        print_success "$name is healthy ✅"
        ((passed++))
    else
        print_error "$name health check failed ❌"
        ((failed++))
    fi
    
    sleep 0.5
done

echo ""
echo "========================================"
echo "🎯 Test Results"
echo "========================================"
echo ""
echo "  Total Services:  $total"
echo "  ✅ Passed:       $passed"
echo "  ❌ Failed:       $failed"
echo ""

if [ $failed -eq 0 ]; then
    print_success "All services are running correctly! 🎉"
    echo ""
    
    # Test API Gateway aggregation
    print_status "Testing API Gateway aggregation..."
    if curl -s -f "http://localhost:4000/health" > /dev/null 2>&1; then
        gateway_response=$(curl -s "http://localhost:4000/health" | jq -r '.status' 2>/dev/null || echo "error")
        if [ "$gateway_response" = "ok" ] || [ "$gateway_response" = "degraded" ]; then
            print_success "API Gateway aggregation working ✅"
        else
            print_warning "API Gateway status: $gateway_response"
        fi
    fi
    
    echo ""
    print_status "Testing unified Swagger..."
    if curl -s -f "http://localhost:4000/api-docs-json" > /dev/null 2>&1; then
        print_success "Unified Swagger documentation available ✅"
        echo ""
        echo "📚 Swagger UI: http://localhost:4000/api-docs"
    else
        print_warning "Swagger documentation check failed"
    fi
    
    echo ""
    echo "🌐 Service URLs:"
    echo "  API Gateway:      http://localhost:4000"
    echo "  Unified Docs:     http://localhost:4000/api-docs"
    echo "  Health Check:     http://localhost:4000/health"
    echo ""
    echo "  Auth:             http://localhost:4002/api-docs"
    echo "  User:             http://localhost:4005/api-docs"
    echo "  Marketplace:      http://localhost:4003/api-docs"
    echo "  Cart:             http://localhost:4009/api-docs"
    echo "  Order:            http://localhost:4004/api-docs"
    echo "  Vendor:           http://localhost:4006/api-docs"
    echo "  Content:          http://localhost:4008/api-docs"
    echo "  Admin:            http://localhost:4007/api-docs"
    echo ""
    
    # Test sample API endpoint
    echo "🔐 Testing Auth API..."
    print_status "Testing user registration endpoint..."
    
    register_response=$(curl -s -X POST http://localhost:4000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test'$(date +%s)'@example.com",
        "password": "Test123456",
        "firstName": "Test",
        "lastName": "User"
      }' 2>/dev/null)
    
    if echo "$register_response" | jq -e '.success' > /dev/null 2>&1; then
        print_success "User registration API working ✅"
        echo ""
        echo "Sample registration response:"
        echo "$register_response" | jq '.' 2>/dev/null || echo "$register_response"
    else
        if echo "$register_response" | grep -q "email"; then
            print_warning "Registration endpoint responding (may need MongoDB)"
        else
            print_error "Registration API test failed"
        fi
    fi
    
    echo ""
    echo "========================================"
    print_success "✅ All Services Operational!"
    echo "========================================"
    echo ""
    echo "🎉 Your microservices platform is ready!"
    echo ""
    exit 0
else
    echo "========================================"
    print_error "Some services failed health checks"
    echo "========================================"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "  1. Check if services are running: ps aux | grep node"
    echo "  2. View logs: tail -f logs/*.log"
    echo "  3. Restart services: ./stop-all-services.sh && ./start-all-services.sh"
    echo "  4. Check infrastructure: docker ps"
    echo ""
    exit 1
fi

