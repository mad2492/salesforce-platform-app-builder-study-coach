@echo off
title Builder Bench - Salesforce Study Coach
cd /d "%~dp0"
echo.
echo  Builder Bench is starting...
echo  Your browser will open automatically.
echo.
echo  Keep this window open while you study.
echo  Close this window when you are finished.
echo.
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000/'"
call "C:\Users\mdennis\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd" run dev

