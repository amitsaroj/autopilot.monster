#!/bin/bash

echo "🛑 Stopping All Microservices..."
echo ""

# Kill by PID files
if [ -d "logs" ]; then
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            service=$(basename "$pid_file" .pid)
            pid=$(cat "$pid_file")
            if ps -p "$pid" > /dev/null 2>&1; then
                echo "🛑 Stopping $service (PID: $pid)..."
                kill "$pid" 2>/dev/null || true
                sleep 1
                if ps -p "$pid" > /dev/null 2>&1; then
                    kill -9 "$pid" 2>/dev/null || true
                fi
            fi
            rm -f "$pid_file"
        fi
    done
fi

# Kill remaining processes
echo "🧹 Cleaning up..."
pkill -f "ts-node-dev" 2>/dev/null || true
pkill -f "node dist/index.js" 2>/dev/null || true

sleep 2

echo ""
echo "✅ All services stopped!"
echo "📝 Logs preserved in logs/"
echo ""
