@echo off
cd backend
echo Installing dependencies...
npm install
echo Starting MongoDB backend server...
npm run dev
pause
