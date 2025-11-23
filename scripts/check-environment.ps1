# Verificar el entorno de desarrollo y funcionalidades disponibles

Write-Host "Verificando entorno de BurbujaApp..." -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js y npm (requisito fundamental)
$nodeInstalled = Get-Command "node" -ErrorAction SilentlyContinue
$npmInstalled = Get-Command "npm" -ErrorAction SilentlyContinue

if (-not $nodeInstalled -or -not $npmInstalled) {
    Write-Host "ERROR: Node.js o npm no estan instalados" -ForegroundColor Red
    Write-Host "   Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   O usa: winget install OpenJS.NodeJS" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "OK - Node.js $(node --version)" -ForegroundColor Green
    Write-Host "OK - npm $(npm --version)" -ForegroundColor Green
}

Write-Host ""

# Verificar si esta instalado EAS CLI
$easInstalled = Get-Command "eas" -ErrorAction SilentlyContinue
if ($easInstalled) {
    Write-Host "OK - EAS CLI instalado" -ForegroundColor Green
    eas --version
} else {
    Write-Host "AVISO - EAS CLI no instalado (opcional)" -ForegroundColor Yellow
    Write-Host "   Para instalar: npm install -g @expo/eas-cli" -ForegroundColor Yellow
}

Write-Host ""

# Verificar configuracion de Expo
if (Test-Path "app.json") {
    $appConfig = Get-Content "app.json" | ConvertFrom-Json
    Write-Host "Configuracion de la app:" -ForegroundColor Blue
    Write-Host "   Nombre: $($appConfig.expo.name)" -ForegroundColor White
    Write-Host "   Slug: $($appConfig.expo.slug)" -ForegroundColor White
    Write-Host "   Version: $($appConfig.expo.version)" -ForegroundColor White
} else {
    Write-Host "ERROR - app.json no encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar package.json para dependencias criticas
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    Write-Host "Dependencias criticas:" -ForegroundColor Blue
    
    # Verificar Expo SDK
    if ($packageJson.dependencies.expo) {
        Write-Host "   OK - Expo SDK: $($packageJson.dependencies.expo)" -ForegroundColor Green
    }
    
    # Verificar expo-notifications
    if ($packageJson.dependencies."expo-notifications") {
        Write-Host "   AVISO - expo-notifications: $($packageJson.dependencies."expo-notifications")" -ForegroundColor Yellow
        Write-Host "      (Push notifications no disponibles en Expo Go desde SDK 53)" -ForegroundColor Yellow
    }
    
    # Verificar react-native
    if ($packageJson.dependencies."react-native") {
        Write-Host "   OK - React Native: $($packageJson.dependencies."react-native")" -ForegroundColor Green
    }
}

Write-Host ""

# Mostrar comandos disponibles
Write-Host "=== COMANDOS DE DESARROLLO ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "1. Setup completo (instalacion + servicios):" -ForegroundColor White
Write-Host "   npm run setup:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Iniciar ambiente (json-server + expo):" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Controlar servicios individual:" -ForegroundColor White
Write-Host "   npm run dev:api:start     # Inicia json-server" -ForegroundColor Gray
Write-Host "   npm run dev:api:stop      # Detiene json-server" -ForegroundColor Gray
Write-Host "   npm run dev:api:status    # Ver estado" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Limpiar cache y reiniciar:" -ForegroundColor White
Write-Host "   npm run clean-start" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Build de desarrollo (requiere EAS):" -ForegroundColor White
Write-Host "   npm run build:dev         # Android" -ForegroundColor Gray
Write-Host "   npm run build:dev:ios     # iOS" -ForegroundColor Gray

Write-Host ""

# Verificar si existe el archivo de configuracion EAS
if (Test-Path "eas.json") {
    Write-Host "OK - eas.json configurado" -ForegroundColor Green
} else {
    Write-Host "AVISO - eas.json no configurado (solo necesario para builds publicados)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Documentacion:" -ForegroundColor Blue
Write-Host "   - docs/Quick-Start.md" -ForegroundColor Gray
Write-Host "   - docs/Guia-Ambiente-Desarrollo.md" -ForegroundColor Gray
Write-Host "   - docs/Notificaciones-SDK53.md" -ForegroundColor Gray
Write-Host "   - https://docs.expo.dev/" -ForegroundColor Gray

Write-Host ""
Write-Host "Entorno listo para desarrollo!" -ForegroundColor Green
