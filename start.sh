#!/bin/bash

echo "=========================================================="
echo "🌿 STARTING SAKRIA WELLNESS OPERATOR PLATFORM 🌿"
echo "=========================================================="

# Kill any existing instances to avoid port conflicts
pkill -f uvicorn 2>/dev/null
pkill -f "http.server 8080" 2>/dev/null
sleep 1

# Activate virtual environment
source venv/bin/activate

# Start FastAPI backend in background
echo "-> Launching FastAPI Backend on http://127.0.0.1:8000..."
./venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3

# Start Frontend SPA (static file server) in background
echo "-> Launching Frontend SPA on http://127.0.0.1:8080..."
python3 -m http.server 8080 > spa_server.log 2>&1 &
FRONTEND_PID=$!

echo "=================================="
echo " ✅ Sakria Platform is ONLINE!"
echo "----------------------------------"
echo " 🌐 Operator App  : http://127.0.0.1:8080"
echo " ⚡ FastAPI Backend: http://127.0.0.1:8000"
echo "----------------------------------"
echo " Login: demo / demo1234 (Coach)"
echo " Login: admin / sakria_admin_2026  (Admin)"
echo "=================================="
echo "PIDs: Backend ($BACKEND_PID) | Frontend ($FRONTEND_PID)"
echo "Press Ctrl+C to shut down all servers."

# Keep script active and handle graceful shutdowns
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
