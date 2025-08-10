@echo off
echo.
echo ================================================================
echo  🚀 BURBUJAPP - Iniciando Entorno de Desarrollo
echo ================================================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encuentra package.json
    echo    Asegurate de ejecutar este script desde la raiz del proyecto
    pause
    exit /b 1
)

echo 📦 Verificando dependencias...
call npm list json-server >nul 2>&1
if errorlevel 1 (
    echo ⚠️  json-server no está instalado, instalando...
    call npm install -D json-server --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Error instalando json-server
        pause
        exit /b 1
    )
)

echo ✅ Dependencias verificadas
echo.

REM Crear directorios de logs si no existen
if not exist "logs" mkdir logs

echo 🗃️  Iniciando JSON Server (Mock API)...
start "JSON Server" cmd /c "npm run mock-api 2>&1 | tee logs/json-server.log"

REM Esperar un poco para que JSON Server se inicie
timeout /t 3 /nobreak >nul

echo 📱 Iniciando React Native (Expo)...
start "Expo Dev" cmd /c "npx expo start --android 2>&1 | tee logs/expo.log"

echo.
echo ================================================================
echo  ✅ Servicios iniciados:
echo ================================================================
echo  🗃️  JSON Server (Mock API): http://localhost:3001
echo  📱 Expo Dev Server: Se abrirá automáticamente
echo.
echo  📝 Logs disponibles en:
echo     - JSON Server: logs/json-server.log
echo     - Expo: logs/expo.log
echo.
echo  🛑 Para detener los servicios:
echo     - Presiona Ctrl+C en cada ventana
echo     - O ejecuta: scripts/stop-dev.bat
echo ================================================================
echo.

REM Esperar antes de cerrar
timeout /t 5 /nobreak >nul
echo Ventanas de desarrollo abiertas. Este script puede cerrarse.
pause
