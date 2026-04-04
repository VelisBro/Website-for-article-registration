@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 20 or newer, then run this file again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm.cmd is not available. Reinstall Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist ".env.local" (
  copy /Y ".env.example" ".env.local" >nul
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm.cmd install
  if errorlevel 1 goto :fail
)

if not exist "prisma\dev.db" (
  echo Preparing local database...
  call npm.cmd run db:generate
  if errorlevel 1 goto :fail
  call npm.cmd run db:push
  if errorlevel 1 goto :fail
  call npm.cmd run db:seed
  if errorlevel 1 goto :fail
)

echo Starting local site...
start "pisunsite-iu5 local server" cmd /k "cd /d \"%~dp0\" && npm.cmd run dev"
timeout /t 8 /nobreak >nul
start "" "http://localhost:3000"

echo The site is opening at http://localhost:3000
echo Keep the server window open while the site is running.
exit /b 0

:fail
echo.
echo Startup failed. Read the error messages above and try again.
pause
exit /b 1
