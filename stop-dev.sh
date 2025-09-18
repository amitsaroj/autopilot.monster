#!/bin/bash

# Autopilot.Monster Development Stop Script
echo "🛑 Stopping Autopilot.Monster Development Environment..."

# Kill processes by PID if available
if [ -d "logs" ]; then
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            if ps -p "$pid" > /dev/null 2>&1; then
                echo "Stopping process $pid..."
                kill "$pid" 2>/dev/null || true
            fi
        fi
    done
fi

# Kill any remaining processes
echo "🧹 Cleaning up remaining processes..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "node dist/main.js" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Wait for cleanup
sleep 2

echo "✅ All services stopped!"
