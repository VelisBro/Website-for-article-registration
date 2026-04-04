@echo off
setlocal

for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /PID %%P /F >nul 2>nul
)

echo Local server on port 3000 has been stopped.
timeout /t 2 /nobreak >nul
