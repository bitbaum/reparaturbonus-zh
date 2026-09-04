#!/bin/bash

echo "🚀 Starting Reparaturbonus development server..."

# Start the development server in background
pnpm run dev &
DEV_PID=$!

# Wait a moment for server to start
sleep 3

# Open browser to localhost:3000
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
else
    echo "🌐 Open http://localhost:3000 in your browser"
fi

echo "📝 Development server started (PID: $DEV_PID)"
echo "🛑 Press Ctrl+C to stop the server"

# Wait for the background process
wait $DEV_PID