@echo off
echo Installing MongoDB Community Server...
echo.
echo Please download and install MongoDB from:
echo https://www.mongodb.com/try/download/community
echo.
echo After installation, run these commands:
echo.
echo 1. Start MongoDB service:
echo    net start MongoDB
echo.
echo 2. Or start manually:
echo    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
echo.
echo 3. Create data directory if needed:
echo    mkdir C:\data\db
echo.
pause
