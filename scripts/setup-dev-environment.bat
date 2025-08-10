@echo off
echo.
echo ================================================================
echo  BURBUJAPP - Configuracion de Entorno de Desarrollo
echo ================================================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ERROR: No se encuentra package.json
    echo Ejecutar este script desde la raiz del proyecto BurbujApp
    pause
    exit /b 1
)

echo Configurando entorno de desarrollo para BurbujApp...
echo.

echo 1. Verificando prerequisitos...
echo.

REM Verificar Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no esta instalado
    echo    Descarga desde: https://nodejs.org/
    echo    Se recomienda la version LTS
    pause
    exit /b 1
) else (
    echo ✅ Node.js encontrado
    node --version
)

REM Verificar npm
echo Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no esta disponible
    pause
    exit /b 1
) else (
    echo ✅ npm encontrado
    npm --version
)

REM Verificar Git (opcional)
echo Verificando Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Git no encontrado (recomendado pero no requerido)
    echo    Descarga desde: https://git-scm.com/
) else (
    echo ✅ Git encontrado
    git --version
)

echo.
echo 2. Limpiando instalaciones previas...

REM Limpiar node_modules y package-lock.json
if exist "node_modules" (
    echo Eliminando node_modules...
    rmdir /s /q "node_modules" 2>nul
)

if exist "package-lock.json" (
    echo Eliminando package-lock.json...
    del "package-lock.json" 2>nul
)

echo.
echo 3. Instalando dependencias del proyecto...

REM Instalar dependencias principales
echo Instalando dependencias principales (esto puede tomar varios minutos)...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Error instalando dependencias principales
    echo Intentando limpiar cache...
    call npm cache clean --force
    echo Reintentando instalacion...
    call npm install --legacy-peer-deps --verbose
    if errorlevel 1 (
        echo ❌ Fallo la instalacion de dependencias
        pause
        exit /b 1
    )
)

echo ✅ Dependencias principales instaladas

REM Instalar json-server específicamente
echo Instalando JSON Server...
call npm install -D json-server --legacy-peer-deps
if errorlevel 1 (
    echo ⚠️  Error instalando json-server (no critico)
) else (
    echo ✅ JSON Server instalado
)

echo.
echo 4. Configurando directorios...

REM Crear directorios necesarios
if not exist "logs" mkdir logs
if not exist "temp" mkdir temp
echo ✅ Directorios creados

echo.
echo 5. Verificando archivos de configuracion...

REM Verificar archivos clave
if exist "app.json" (echo ✅ app.json) else (echo ⚠️  app.json faltante)
if exist "babel.config.js" (echo ✅ babel.config.js) else (echo ⚠️  babel.config.js faltante)
if exist "tsconfig.json" (echo ✅ tsconfig.json) else (echo ⚠️  tsconfig.json faltante)
if exist "db.json" (echo ✅ db.json) else (echo ⚠️  db.json faltante)

echo.
echo 6. Obteniendo IP local...

REM Obtener IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4.*192\.168\."') do (
    set LOCAL_IP=%%a
    set LOCAL_IP=!LOCAL_IP: =!
    echo ✅ IP local detectada: !LOCAL_IP!
    goto :ip_found
)

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4.*10\."') do (
    set LOCAL_IP=%%a
    set LOCAL_IP=!LOCAL_IP: =!
    echo ✅ IP local detectada: !LOCAL_IP!
    goto :ip_found
)

echo ⚠️  No se pudo detectar IP local automaticamente
echo    Configurar manualmente en src/services/config/IpConfig.ts

:ip_found

echo.
echo ================================================================
echo  ✅ CONFIGURACION COMPLETADA
echo ================================================================
echo.
echo Entorno de desarrollo configurado exitosamente!
echo.
echo COMANDOS DISPONIBLES:
echo   npm run dev          - Iniciar entorno completo
echo   npm run dev:fast     - Iniciar con API rapida  
echo   npm run dev:stop     - Detener servicios
echo   npm run mock-api     - Solo JSON Server
echo   npm start            - Solo Expo
echo.
echo URLS IMPORTANTES:
echo   JSON Server: http://localhost:3001
echo   Expo Metro:  http://localhost:8081
echo.
echo PROXIMO PASO:
echo   Ejecuta: npm run dev
echo.
echo ================================================================
echo.

pause
