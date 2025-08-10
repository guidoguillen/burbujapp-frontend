# BURBUJAPP - Script de Desarrollo Simplificado
# Inicia JSON Server y Expo simultáneamente

param(
    [switch]$Fast,        # Usar mock-api-fast en lugar de mock-api
    [switch]$AndroidOnly, # Solo Android, no abrir navegador
    [switch]$Help         # Mostrar ayuda
)

if ($Help) {
    Write-Host "BURBUJAPP - Script de Desarrollo"
    Write-Host ""
    Write-Host "USO: .\start-dev.ps1 [opciones]"
    Write-Host ""
    Write-Host "OPCIONES:"
    Write-Host "  -Fast         Usa JSON Server sin delay"
    Write-Host "  -AndroidOnly  Solo inicia Android"
    Write-Host "  -Help         Muestra esta ayuda"
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " BURBUJAPP - Iniciando Entorno de Desarrollo" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encuentra package.json" -ForegroundColor Red
    Write-Host "Ejecutar desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "Verificando dependencias..." -ForegroundColor Yellow

# Verificar json-server
try {
    $null = npm list json-server 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Instalando json-server..." -ForegroundColor Yellow
        npm install -D json-server --legacy-peer-deps
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error instalando json-server" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "Error verificando dependencias" -ForegroundColor Red
    exit 1
}

Write-Host "Dependencias verificadas" -ForegroundColor Green
Write-Host ""

# Crear directorio de logs
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" -Force | Out-Null
}

# Seleccionar comando de API
$apiCommand = if ($Fast) { "mock-api-fast" } else { "mock-api" }
$apiDescription = if ($Fast) { "JSON Server (Rapido)" } else { "JSON Server" }

Write-Host "Iniciando $apiDescription..." -ForegroundColor Yellow

# Iniciar JSON Server en background
$jsonServerJob = Start-Job -ScriptBlock {
    param($projectPath, $apiCommand)
    Set-Location $projectPath
    npm run $apiCommand
} -ArgumentList (Get-Location), $apiCommand

# Esperar que JSON Server inicie
Start-Sleep -Seconds 3

# Verificar JSON Server
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/clientes" -TimeoutSec 5 -UseBasicParsing
    Write-Host "JSON Server iniciado correctamente" -ForegroundColor Green
} catch {
    Write-Host "JSON Server iniciando, continuando..." -ForegroundColor Yellow
}

Write-Host "Iniciando Expo..." -ForegroundColor Yellow

# Preparar comando de Expo
$expoArgs = @("start")
if ($AndroidOnly) {
    $expoArgs += "--android"
}

# Iniciar Expo
try {
    Start-Process -FilePath "npx" -ArgumentList "expo", $expoArgs -NoNewWindow
    Write-Host "Expo Dev Server iniciado" -ForegroundColor Green
} catch {
    Write-Host "Error iniciando Expo" -ForegroundColor Red
    Stop-Job $jsonServerJob -Force
    Remove-Job $jsonServerJob -Force
    exit 1
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " Servicios iniciados:" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " JSON Server: http://localhost:3001" -ForegroundColor Green
Write-Host " Expo Dev Server: Se abrira automaticamente" -ForegroundColor Green
Write-Host ""
Write-Host " Endpoints disponibles:" -ForegroundColor Cyan
Write-Host "    - http://localhost:3001/clientes"
Write-Host "    - http://localhost:3001/servicios"
Write-Host "    - http://localhost:3001/ordenes"
Write-Host "    - http://localhost:3001/dashboard"
Write-Host ""
Write-Host " Para detener: Ctrl+C o npm run dev:stop" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Logs de JSON Server (Ctrl+C para detener):" -ForegroundColor Cyan
Write-Host ""

# Mantener corriendo y mostrar logs
try {
    while ($jsonServerJob.State -eq "Running") {
        $jobOutput = Receive-Job $jsonServerJob
        if ($jobOutput) {
            Write-Host $jobOutput
        }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host ""
    Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
    Stop-Job $jsonServerJob -Force 2>$null
    Remove-Job $jsonServerJob -Force 2>$null
    Write-Host "JSON Server detenido" -ForegroundColor Green
}
