@echo off
echo Starting LocalBiz with MongoDB...
echo.

REM Start MongoDB first
echo Step 1: Starting MongoDB...
start "MongoDB" mongod --dbpath="C:\data\db"

REM Wait a moment for MongoDB to start
timeout /t 5 /nobreak >nul

REM Start the backend
echo Step 2: Starting Backend Server...
cd backend
npm run dev

pause
