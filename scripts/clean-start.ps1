# Script para limpiar warnings y reiniciar el entorno de desarrollo

Write-Host "🧹 Limpiando entorno de desarrollo..." -ForegroundColor Cyan

# Detener cualquier proceso de Expo en ejecución
Write-Host "Deteniendo procesos de Expo..." -ForegroundColor Yellow
Get-Process -Name "expo" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" -and $_.CommandLine -like "*expo*" } | Stop-Process -Force

# Limpiar cache de Metro
Write-Host "Limpiando cache de Metro..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item "node_modules\.cache" -Recurse -Force
    Write-Host "✅ Cache de Metro limpiado" -ForegroundColor Green
}

# Limpiar cache de Expo
Write-Host "Limpiando cache de Expo..." -ForegroundColor Yellow
npx expo r -c --clear

# Reinstalar dependencias si es necesario
$reinstall = Read-Host "¿Reinstalar node_modules? (y/N)"
if ($reinstall -eq "y" -or $reinstall -eq "Y") {
    Write-Host "Reinstalando dependencias..." -ForegroundColor Yellow
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
    npm install
}

Write-Host ""
Write-Host "🔧 Aplicando configuración anti-warnings..." -ForegroundColor Blue

# Verificar que los archivos de configuración existen
$configFiles = @(
    "src\polyfills\suppressWarnings.ts",
    "metro.config.js",
    "index.ts"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file configurado" -ForegroundColor Green
    } else {
        Write-Host "❌ $file faltante" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🚀 Iniciando Expo con configuración limpia..." -ForegroundColor Magenta

# Iniciar Expo con variables de entorno para suprimir warnings
$env:EXPO_NO_CACHE = "1"
$env:METRO_NO_CACHE = "1"

expo start --clear

Write-Host "✨ Entorno limpio iniciado!" -ForegroundColor Green
