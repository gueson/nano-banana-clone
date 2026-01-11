@echo off
setlocal

set "PNPM_HOST=%APPDATA%\npm\pnpm.cmd"

if exist "%PNPM_HOST%" (
  "%PNPM_HOST%" %*
  exit /b %ERRORLEVEL%
)

pnpm %*
exit /b %ERRORLEVEL%

