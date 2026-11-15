@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set "NODE_EXE="
for %%I in (node.exe) do if not "%%~$PATH:I"=="" set "NODE_EXE=%%~$PATH:I"
if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LocalAppData%\Programs\node\node.exe" set "NODE_EXE=%LocalAppData%\Programs\node\node.exe"
if not defined NODE_EXE if exist "E:\pinokio\bin\miniforge\node.exe" set "NODE_EXE=E:\pinokio\bin\miniforge\node.exe"
if not defined NODE_EXE (
  echo [Error] Node.js ^>= 20 was not found in PATH.
  echo Please install Node.js 20+ from https://nodejs.org/ and run: node server.mjs
  pause
  exit /b 1
)

set "PORT=4173"
netstat -ano | findstr /C:":%PORT% " | findstr /C:"LISTENING" >nul
if %errorlevel%==0 (
  echo Jingxu Workbench is already running at http://127.0.0.1:%PORT%
  start "" "http://127.0.0.1:%PORT%"
  exit /b 0
)

echo Starting Jingxu Workbench at http://127.0.0.1:%PORT% ...
start /b cmd /c "timeout /t 1 /nobreak >nul & start "" "http://127.0.0.1:%PORT%""
"%NODE_EXE%" "%~dp0server.mjs"
pause
