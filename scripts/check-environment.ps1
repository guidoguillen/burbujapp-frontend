# Verificar el entorno de desarrollo y funcionalidades disponibles

Write-Host "🔧 Verificando entorno de BurbujaApp..." -ForegroundColor Cyan
Write-Host ""

# Verificar si está instalado EAS CLI
$easInstalled = Get-Command "eas" -ErrorAction SilentlyContinue
if ($easInstalled) {
    Write-Host "✅ EAS CLI instalado" -ForegroundColor Green
    eas --version
} else {
    Write-Host "❌ EAS CLI no instalado" -ForegroundColor Red
    Write-Host "   Para instalar: npm install -g @expo/eas-cli" -ForegroundColor Yellow
}

Write-Host ""

# Verificar configuración de Expo
if (Test-Path "app.json") {
    $appConfig = Get-Content "app.json" | ConvertFrom-Json
    Write-Host "📱 Configuración de la app:" -ForegroundColor Blue
    Write-Host "   Nombre: $($appConfig.expo.name)" -ForegroundColor White
    Write-Host "   Slug: $($appConfig.expo.slug)" -ForegroundColor White
    Write-Host "   Versión: $($appConfig.expo.version)" -ForegroundColor White
} else {
    Write-Host "❌ app.json no encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar package.json para dependencias críticas
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    Write-Host "📦 Dependencias críticas:" -ForegroundColor Blue
    
    # Verificar Expo SDK
    if ($packageJson.dependencies.expo) {
        Write-Host "   ✅ Expo SDK: $($packageJson.dependencies.expo)" -ForegroundColor Green
    }
    
    # Verificar expo-notifications
    if ($packageJson.dependencies."expo-notifications") {
        Write-Host "   ⚠️  expo-notifications: $($packageJson.dependencies."expo-notifications")" -ForegroundColor Yellow
        Write-Host "      (Push notifications no disponibles en Expo Go desde SDK 53)" -ForegroundColor Yellow
    }
    
    # Verificar react-native
    if ($packageJson.dependencies."react-native") {
        Write-Host "   ✅ React Native: $($packageJson.dependencies."react-native")" -ForegroundColor Green
    }
}

Write-Host ""

# Mostrar opciones disponibles
Write-Host "🚀 Opciones de desarrollo:" -ForegroundColor Magenta
Write-Host "   1. Expo Go (desarrollo normal):" -ForegroundColor White
Write-Host "      npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Development Build (todas las funcionalidades):" -ForegroundColor White
Write-Host "      eas build --platform android --profile development" -ForegroundColor Gray
Write-Host "      eas build --platform ios --profile development" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Verificar funcionalidades disponibles:" -ForegroundColor White
Write-Host "      Ver logs de la consola al iniciar la app" -ForegroundColor Gray

Write-Host ""

# Verificar si existe el archivo de configuración EAS
if (Test-Path "eas.json") {
    Write-Host "✅ eas.json configurado" -ForegroundColor Green
} else {
    Write-Host "❌ eas.json no encontrado" -ForegroundColor Red
    Write-Host "   Para configurar: eas build:configure" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 Documentación adicional:" -ForegroundColor Blue
Write-Host "   • docs/Notificaciones-SDK53.md" -ForegroundColor Gray
Write-Host "   • https://docs.expo.dev/develop/development-builds/" -ForegroundColor Gray

Write-Host ""
Write-Host "✨ Listo para desarrollo!" -ForegroundColor Green
