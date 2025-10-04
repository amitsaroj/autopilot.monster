#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Stopping All Services${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Function to stop a service
stop_service() {
    local service_name=$1
    local pid_file="logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${YELLOW}Stopping ${service_name} (PID: $pid)...${NC}"
            kill $pid 2>/dev/null
            sleep 1
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${RED}Force killing ${service_name}...${NC}"
                kill -9 $pid 2>/dev/null
            fi
            echo -e "${GREEN}✓ ${service_name} stopped${NC}"
        else
            echo -e "${YELLOW}${service_name} is not running${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}No PID file for ${service_name}${NC}"
    fi
}

# Stop all services
stop_service "API Gateway"
stop_service "Auth Service"
stop_service "Catalog Service"
stop_service "Payment Service"
stop_service "User Service"
stop_service "Vendor Service"
stop_service "Frontend"

# Kill any remaining npm processes
echo ""
echo -e "${YELLOW}Cleaning up any remaining processes...${NC}"
pkill -f "npm run start:dev" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
pkill -f "next dev" 2>/dev/null

sleep 2

echo ""
echo -e "${GREEN}All services stopped!${NC}"
echo ""

