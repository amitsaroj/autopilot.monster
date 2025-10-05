#!/bin/bash

# ==============================================
# Autopilot Monster - Stop Services Script
# ==============================================

echo "🛑 Stopping Autopilot Monster Services..."
echo ""

# Kill processes by PID files
if [ -d "logs" ]; then
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            service_name=$(basename "$pid_file" .pid)
            pid=$(cat "$pid_file")
            if ps -p "$pid" > /dev/null 2>&1; then
                echo "🛑 Stopping $service_name (PID: $pid)..."
                kill "$pid" 2>/dev/null || true
                sleep 1
                # Force kill if still running
                if ps -p "$pid" > /dev/null 2>&1; then
                    kill -9 "$pid" 2>/dev/null || true
                fi
            else
                echo "ℹ️  $service_name already stopped"
            fi
            rm -f "$pid_file"
        fi
    done
fi

# Kill any remaining processes
echo ""
echo "🧹 Cleaning up remaining processes..."
pkill -f "ts-node-dev" 2>/dev/null || true
pkill -f "node.*auth-service" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

sleep 2

echo ""
echo "✅ All services stopped successfully!"
echo "📝 Logs preserved in logs/ directory"
echo ""

