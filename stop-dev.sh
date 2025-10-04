#!/bin/bash

# Autopilot.Monster Development Stop Script
echo "🛑 Stopping Autopilot.Monster Development Environment..."

# Kill processes by PID if available
if [ -d "logs" ]; then
    echo "📋 Stopping services by PID..."
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            service_name=$(basename "$pid_file" .pid)
            pid=$(cat "$pid_file")
            if ps -p "$pid" > /dev/null 2>&1; then
                echo "🛑 Stopping $service_name (PID: $pid)..."
                kill "$pid" 2>/dev/null || true
            else
                echo "ℹ️  $service_name already stopped"
            fi
        fi
    done
fi

# Kill any remaining processes
echo "🧹 Cleaning up remaining processes..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "node dist/main.js" 2>/dev/null || true
pkill -f "npm run start:dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Wait for cleanup
sleep 3

# Clean up PID files
if [ -d "logs" ]; then
    rm -f logs/*.pid
    echo "🗑️  Cleaned up PID files"
fi

echo ""
echo "✅ All services stopped successfully!"
echo "📝 Logs are preserved in the 'logs' directory"
echo "🚀 To start again, run: ./start-dev.sh"
