#!/bin/bash
# ==============================================================================
# QUADRAS - Stop Development Environment (Linux/macOS)
# ==============================================================================

echo ""
echo "========================================"
echo "  QUADRAS - Stopping Development Stack"
echo "========================================"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

echo "[INFO] Stopping containers..."
docker-compose down

echo ""
echo "[SUCCESS] All containers stopped."
echo ""
