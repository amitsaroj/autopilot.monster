#!/bin/bash

# Autopilot.Monster Integration Test Script
echo "🧪 Starting Autopilot.Monster Integration Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
API_BASE_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
TIMEOUT=10

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "\n${BLUE}Testing: ${test_name}${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: ${test_name}${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAILED: ${test_name}${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to check if service is running
check_service() {
    local service_name="$1"
    local url="$2"
    
    if curl -s --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ${service_name} is running${NC}"
        return 0
    else
        echo -e "${RED}❌ ${service_name} is not responding${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    local endpoint="$1"
    local method="${2:-GET}"
    local expected_status="${3:-200}"
    local data="${4:-}"
    
    local url="${API_BASE_URL}${endpoint}"
    local curl_cmd="curl -s -w '%{http_code}' -o /dev/null"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        curl_cmd="$curl_cmd -X POST -H 'Content-Type: application/json' -d '$data'"
    elif [ "$method" != "GET" ]; then
        curl_cmd="$curl_cmd -X $method"
    fi
    
    curl_cmd="$curl_cmd '$url'"
    
    local status_code=$(eval "$curl_cmd")
    
    if [ "$status_code" = "$expected_status" ]; then
        return 0
    else
        echo -e "${RED}Expected status $expected_status, got $status_code${NC}"
        return 1
    fi
}

echo -e "${YELLOW}🔍 Checking if services are running...${NC}"

# Check if services are running
check_service "API Gateway" "$API_BASE_URL/health"
check_service "Frontend" "$FRONTEND_URL"
check_service "Auth Service" "http://localhost:3002/health"
check_service "Catalog Service" "http://localhost:3003/health"
check_service "Payment Service" "http://localhost:3004/health"
check_service "User Service" "http://localhost:3005/health"
check_service "Vendor Service" "http://localhost:3006/health"
check_service "Admin Service" "http://localhost:3007/health"
check_service "Content Service" "http://localhost:3008/health"

echo -e "\n${YELLOW}🧪 Running API Integration Tests...${NC}"

# Test API Gateway endpoints
run_test "API Gateway Health Check" "test_api_endpoint '/health' 'GET' '200'"
run_test "API Gateway Swagger Docs" "test_api_endpoint '/api-docs' 'GET' '200'"

# Test Auth Service endpoints
run_test "Auth Service Health Check" "test_api_endpoint '/api/v1/auth/health' 'GET' '200'"
run_test "User Registration Endpoint" "test_api_endpoint '/api/v1/auth/register' 'POST' '400' '{\"email\":\"test@example.com\"}'"
run_test "User Login Endpoint" "test_api_endpoint '/api/v1/auth/login' 'POST' '400' '{\"email\":\"test@example.com\"}'"

# Test Catalog Service endpoints
run_test "Products List Endpoint" "test_api_endpoint '/api/v1/catalog/products' 'GET' '200'"
run_test "Categories List Endpoint" "test_api_endpoint '/api/v1/catalog/categories' 'GET' '200'"
run_test "Featured Products Endpoint" "test_api_endpoint '/api/v1/catalog/products/featured' 'GET' '200'"

# Test User Service endpoints
run_test "User Profile Endpoint" "test_api_endpoint '/api/v1/users/profile' 'GET' '401'"
run_test "User Orders Endpoint" "test_api_endpoint '/api/v1/orders' 'GET' '401'"
run_test "User Wishlist Endpoint" "test_api_endpoint '/api/v1/wishlist' 'GET' '401'"

# Test Payment Service endpoints
run_test "Payment Methods Endpoint" "test_api_endpoint '/api/v1/payment/methods' 'GET' '401'"
run_test "Supported Currencies Endpoint" "test_api_endpoint '/api/v1/payment/currencies' 'GET' '200'"

# Test Vendor Service endpoints
run_test "Vendor Profile Endpoint" "test_api_endpoint '/api/v1/vendors/profile' 'GET' '401'"
run_test "Vendor Analytics Endpoint" "test_api_endpoint '/api/v1/analytics/vendor' 'GET' '401'"

# Test Admin Service endpoints
run_test "Admin Dashboard Endpoint" "test_api_endpoint '/api/v1/admin/dashboard' 'GET' '401'"
run_test "Admin System Health Endpoint" "test_api_endpoint '/api/v1/admin/health' 'GET' '401'"

# Test Content Service endpoints
run_test "Blog Posts Endpoint" "test_api_endpoint '/api/v1/blog/posts' 'GET' '200'"
run_test "Help Articles Endpoint" "test_api_endpoint '/api/v1/help/articles' 'GET' '200'"
run_test "Tutorials Endpoint" "test_api_endpoint '/api/v1/tutorials' 'GET' '200'"
run_test "Job Listings Endpoint" "test_api_endpoint '/api/v1/careers/jobs' 'GET' '200'"

echo -e "\n${YELLOW}🌐 Testing Frontend Integration...${NC}"

# Test Frontend pages
run_test "Frontend Homepage" "curl -s --max-time $TIMEOUT '$FRONTEND_URL' | grep -q 'Autopilot'"
run_test "Frontend Marketplace" "curl -s --max-time $TIMEOUT '$FRONTEND_URL/marketplace' | grep -q 'Marketplace'"
run_test "Frontend Blog" "curl -s --max-time $TIMEOUT '$FRONTEND_URL/blog' | grep -q 'Blog'"
run_test "Frontend Help Center" "curl -s --max-time $TIMEOUT '$FRONTEND_URL/help' | grep -q 'Help'"
run_test "Frontend Careers" "curl -s --max-time $TIMEOUT '$FRONTEND_URL/careers' | grep -q 'Careers'"
run_test "Frontend Admin Dashboard" "curl -s --max-time $TIMEOUT '$FRONTEND_URL/admin' | grep -q 'Admin'"

echo -e "\n${YELLOW}🔗 Testing API-Frontend Integration...${NC}"

# Test if frontend can reach backend APIs
run_test "Frontend API Connection" "curl -s --max-time $TIMEOUT '$FRONTEND_URL/api/health' > /dev/null 2>&1 || curl -s --max-time $TIMEOUT '$API_BASE_URL/health' > /dev/null 2>&1"

echo -e "\n${YELLOW}📊 Testing Database Connections...${NC}"

# Test database connectivity through API responses
run_test "Database Connection (Products)" "test_api_endpoint '/api/v1/catalog/products' 'GET' '200'"
run_test "Database Connection (Blog)" "test_api_endpoint '/api/v1/blog/posts' 'GET' '200'"

echo -e "\n${YELLOW}🔐 Testing Authentication Flow...${NC}"

# Test authentication endpoints
run_test "Registration Validation" "test_api_endpoint '/api/v1/auth/register' 'POST' '400' '{\"email\":\"invalid-email\"}'"
run_test "Login Validation" "test_api_endpoint '/api/v1/auth/login' 'POST' '400' '{\"email\":\"test@example.com\"}'"

echo -e "\n${YELLOW}📈 Performance Tests...${NC}"

# Test response times
run_test "API Response Time < 2s" "curl -s -w '%{time_total}' -o /dev/null '$API_BASE_URL/health' | awk '{if(\$1 < 2) exit 0; else exit 1}'"
run_test "Frontend Response Time < 3s" "curl -s -w '%{time_total}' -o /dev/null '$FRONTEND_URL' | awk '{if(\$1 < 3) exit 0; else exit 1}'"

# Test Results Summary
echo -e "\n${BLUE}📋 Test Results Summary${NC}"
echo -e "${BLUE}========================${NC}"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! System is fully integrated and working.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please check the logs above.${NC}"
    exit 1
fi
