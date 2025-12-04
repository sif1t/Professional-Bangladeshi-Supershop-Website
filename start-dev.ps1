# Quick Start Script for Local Development

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   Bangladeshi Supershop - Local Development" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Write-Host ""
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Write-Host ""
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   Servers Starting!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Two new windows have opened:" -ForegroundColor White
Write-Host "  1. Backend (Express.js on port 5000)" -ForegroundColor Gray
Write-Host "  2. Frontend (Next.js on port 3000)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop servers" -ForegroundColor White
Write-Host ""
