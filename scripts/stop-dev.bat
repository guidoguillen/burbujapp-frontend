@echo off
echo.
echo ================================================================
echo  🛑 BURBUJAPP - Deteniendo Entorno de Desarrollo
echo ================================================================
echo.

echo 🔍 Buscando procesos de desarrollo...

REM Detener JSON Server (puerto 3001)
echo 🗃️  Deteniendo JSON Server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo    Deteniendo proceso %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Detener Expo (puerto por defecto 8081)
echo 📱 Deteniendo Expo Dev Server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do (
    echo    Deteniendo proceso %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Detener procesos de Node relacionados con el proyecto
echo 🔄 Limpiando procesos Node.js del proyecto...
wmic process where "name='node.exe' and commandline like '%%json-server%%'" delete >nul 2>&1
wmic process where "name='node.exe' and commandline like '%%expo%%'" delete >nul 2>&1

echo.
echo ✅ Servicios detenidos
echo.
echo 🧹 Limpiando archivos temporales...
if exist "logs\*.log" del /q "logs\*.log" >nul 2>&1

echo.
echo ================================================================
echo  ✅ Entorno de desarrollo detenido completamente
echo ================================================================
echo.

timeout /t 3 /nobreak >nul
