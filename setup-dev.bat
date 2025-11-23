@echo off
REM Envolvente para ejecutar setup-dev-simple.ps1 con parametros
REM Uso: setup-dev.bat [SkipInstall] [SkipMock] [AndroidOnly] [ClearCache]

setlocal enabledelayedexpansion

set "params="
if "%~1"=="SkipInstall" set "params=!params! -SkipInstall"
if "%~1"=="SkipMock" set "params=!params! -SkipMock"
if "%~1"=="AndroidOnly" set "params=!params! -AndroidOnly"
if "%~1"=="ClearCache" set "params=!params! -ClearCache"

if "%~2"=="SkipInstall" set "params=!params! -SkipInstall"
if "%~2"=="SkipMock" set "params=!params! -SkipMock"
if "%~2"=="AndroidOnly" set "params=!params! -AndroidOnly"
if "%~2"=="ClearCache" set "params=!params! -ClearCache"

if "%~3"=="SkipInstall" set "params=!params! -SkipInstall"
if "%~3"=="SkipMock" set "params=!params! -SkipMock"
if "%~3"=="AndroidOnly" set "params=!params! -AndroidOnly"
if "%~3"=="ClearCache" set "params=!params! -ClearCache"

powershell -ExecutionPolicy Bypass -File scripts/setup-dev-simple.ps1 !params!
