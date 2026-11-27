@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Install Node.js 22 LTS and reopen this file. & pause & exit /b 1)
call npm ci || goto failed
call npm run build || goto failed
echo Open http://localhost:3000 in your browser. Press Ctrl+C here to stop.
call npm start -- --hostname 127.0.0.1
exit /b %errorlevel%
:failed
echo Setup stopped. Review the error above.
pause
exit /b 1
