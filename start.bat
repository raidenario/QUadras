@echo off
REM ==============================================================================
REM QUADRAS - Start Development Environment (Windows)
REM ==============================================================================

echo.
echo ========================================
echo   QUADRAS - Starting Development Stack
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [INFO] Starting containers...
docker-compose up -d --build

echo.
echo [INFO] Waiting for database to be ready...
timeout /t 5 /nobreak >nul

echo.
echo [INFO] Running database migrations...
docker-compose exec api mix ecto.setup

echo.
echo ========================================
echo   QUADRAS is running!
echo   API: http://localhost:4000
echo ========================================
echo.
echo Press any key to view logs (Ctrl+C to exit)...
pause >nul

docker-compose logs -f api
