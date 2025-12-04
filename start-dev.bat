@echo off
echo ===============================================
echo   Bangladeshi Supershop - Local Development
echo ===============================================
echo.

echo Starting Backend Server...
echo.
start cmd /k "cd backend && echo Backend Server Starting... && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
echo.
start cmd /k "cd frontend && echo Frontend Server Starting... && npm run dev"

echo.
echo ===============================================
echo   Servers Starting!
echo ===============================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to view this information again...
pause > nul

echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
