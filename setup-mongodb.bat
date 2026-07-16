@echo off
echo Setting up MongoDB for LocalBiz...
echo.

REM Create data directory
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db"
)

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB not found. Please install MongoDB Community Server:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo Starting MongoDB server...
start "MongoDB Server" mongod --dbpath="C:\data\db"

echo Waiting for MongoDB to start...
timeout /t 3 /nobreak >nul

echo.
echo MongoDB should now be running!
echo You can now start your backend server.
echo.
pause
