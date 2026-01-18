@echo off
REM ==============================================================================
REM QUADRAS - Stop Development Environment (Windows)
REM ==============================================================================

echo.
echo ========================================
echo   QUADRAS - Stopping Development Stack
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo [INFO] Stopping containers...
docker-compose down

echo.
echo [SUCCESS] All containers stopped.
echo.
pause
