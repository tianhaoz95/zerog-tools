#!/bin/bash

# Port cleanup utility to make sure the ports are free before we start
cleanup_ports() {
  # Port 5000-5002 for Firebase Hosting
  for port in 5000 5001 5002 4400 4401 4500 4501; do
    pid=$(lsof -t -i :$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
      echo "Cleaning up stray process on port $port (PID: $pid)..."
      kill -9 $pid 2>/dev/null
    fi
  done
}

# Function to shut down all processes on exit
cleanup() {
  echo -e "\nGracefully shutting down all services..."
  # Disable trap to avoid recursion
  trap - INT TERM EXIT
  
  # Kill all background jobs spawned by this shell session
  jobs -p | xargs kill -TERM 2>/dev/null
  
  # Give background jobs a second to terminate
  sleep 1
  
  # Force kill any remaining jobs
  jobs -p | xargs kill -9 2>/dev/null
  
  echo "All services terminated. Exiting."
  exit 0
}

# Trap Ctrl+C (SIGINT), SIGTERM, and shell exit
trap cleanup INT TERM EXIT

# Perform pre-startup port cleanup
cleanup_ports

# Kill stray build watchers from previous sessions. Two concurrent
# `vite build --watch` processes race on dist/ (each empties it before
# writing), which serves half-built pages and blanks the app.
pkill -f "$(pwd)/node_modules/.bin/vite build --watch" 2>/dev/null
pkill -f "npm exec vite build --watch" 2>/dev/null
sleep 1

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing dependencies..."
  npm install
fi

# Build project once to ensure dist exists
echo "Building project..."
npx vite build

# Start Vite Watcher and Firebase Emulator in the background
echo "Starting Vite Watcher and Firebase Emulator..."
npx vite build --watch &
VITE_PID=$!

npx firebase emulators:start --only hosting &
FIREBASE_PID=$!

echo "Development environment is running on port 5000/5002. Press Ctrl+C to stop."

# Wait for background jobs to finish
wait
