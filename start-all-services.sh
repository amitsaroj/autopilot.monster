#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Autopilot.Monster - Start All Services${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Kill any existing processes
echo -e "${YELLOW}Stopping existing processes...${NC}"
pkill -f "npm run start:dev" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
sleep 2

# Create logs directory
mkdir -p logs

# Function to start a service
start_service() {
    local service_name=$1
    local service_port=$2
    local service_path=$3
    
    echo -e "${YELLOW}Starting ${service_name}...${NC}"
    
    cd "$service_path" || exit 1
    
    # Start the service in the background and redirect output to log file
    npm run start:dev > "../../logs/${service_name}.log" 2>&1 &
    local pid=$!
    
    echo -e "${GREEN}✓ ${service_name} started (PID: $pid, Port: $service_port)${NC}"
    echo "$pid" > "../../logs/${service_name}.pid"
    
    cd - > /dev/null || exit 1
}

# Function to start frontend
start_frontend() {
    echo -e "${YELLOW}Starting Frontend...${NC}"
    
    cd frontend || exit 1
    
    npm run dev > "../logs/frontend.log" 2>&1 &
    local pid=$!
    
    echo -e "${GREEN}✓ Frontend started (PID: $pid, Port: 3000)${NC}"
    echo "$pid" > "../logs/frontend.pid"
    
    cd - > /dev/null || exit 1
}

# Start all services
echo -e "${BLUE}Starting backend services...${NC}"
echo ""

start_service "API Gateway" "4000" "services/api-gateway"
sleep 3

start_service "Auth Service" "3001" "services/auth-service"
sleep 2

start_service "Catalog Service" "3002" "services/catalog-service"
sleep 2

start_service "Payment Service" "3003" "services/payment-service"
sleep 2

start_service "User Service" "3004" "services/user-service"
sleep 2

start_service "Vendor Service" "3005" "services/vendor-service"
sleep 2

echo ""
echo -e "${BLUE}Starting frontend...${NC}"
echo ""

start_frontend

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  All Services Started Successfully!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${BLUE}Service URLs:${NC}"
echo -e "  • API Gateway:      http://localhost:4000"
echo -e "  • API Gateway Docs: http://localhost:4000/api-docs"
echo -e "  • Auth Service:     http://localhost:3001"
echo -e "  • Catalog Service:  http://localhost:3002"
echo -e "  • Payment Service:  http://localhost:3003"
echo -e "  • User Service:     http://localhost:3004"
echo -e "  • Vendor Service:   http://localhost:3005"
echo -e "  • Frontend:         http://localhost:3000"
echo ""
echo -e "${YELLOW}Log files are in: ./logs/${NC}"
echo -e "${YELLOW}To stop all services, run: ./stop-all-services.sh${NC}"
echo ""
echo -e "${BLUE}Checking service health in 10 seconds...${NC}"
sleep 10

echo ""
echo -e "${BLUE}Health Check Results:${NC}"

# Health check function
check_health() {
    local name=$1
    local url=$2
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $name is healthy${NC}"
    else
        echo -e "${RED}✗ $name is not responding${NC}"
    fi
}

check_health "API Gateway" "http://localhost:4000/api/v1/health"
check_health "Auth Service" "http://localhost:3001/health"
check_health "Catalog Service" "http://localhost:3002/health"
check_health "Payment Service" "http://localhost:3003/health"
check_health "User Service" "http://localhost:3004/health"
check_health "Vendor Service" "http://localhost:3005/health"
check_health "Frontend" "http://localhost:3000"

echo ""
echo -e "${GREEN}All done! Services are running in the background.${NC}"

