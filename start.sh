#!/bin/bash
# ==============================================================================
# QUADRAS - Start Development Environment (Linux/macOS)
# ==============================================================================

set -e

echo ""
echo "========================================"
echo "  QUADRAS - Starting Development Stack"
echo "========================================"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running. Please start Docker first."
    exit 1
fi

echo "[INFO] Starting containers..."
docker-compose up -d --build

echo ""
echo "[INFO] Waiting for database to be ready..."
sleep 5

echo ""
echo "[INFO] Running database setup..."
docker-compose exec api mix ecto.setup

echo ""
echo "========================================"
echo "  QUADRAS is running!"
echo "  API: http://localhost:4000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop viewing logs..."
echo ""

docker-compose logs -f api
