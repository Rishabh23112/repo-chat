@echo off
cd frontend
echo Installing frontend dependencies...
call npm install
echo.
echo Starting Vite dev server...
call npm run dev
