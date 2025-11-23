# Script simple para setup de desarrollo
# Parametros: -SkipInstall, -SkipMock, -AndroidOnly, -ClearCache

param(
    [switch]$SkipInstall,
    [switch]$SkipMock,
    [switch]$AndroidOnly,
    [switch]$ClearCache
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== PASO 1: VERIFICAR ENTORNO ===" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
$nodeCmd = Get-Command "node" -ErrorAction SilentlyContinue
$npmCmd = Get-Command "npm" -ErrorAction SilentlyContinue

if (-not $nodeCmd -or -not $npmCmd) {
    Write-Host "ERROR: Node.js o npm no estan en PATH" -ForegroundColor Red
    Write-Host "Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

$nodeVersion = & node --version
$npmVersion = & npm --version

Write-Host "OK - Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "OK - npm: $npmVersion" -ForegroundColor Green

Write-Host ""
Write-Host "=== PASO 2: VALIDAR ARCHIVOS ===" -ForegroundColor Cyan
Write-Host ""

$files = @("app.json", "package.json", "db.json", "metro.config.js")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK - $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR - $file no encontrado" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# PASO 3: LIMPIAR CACHE
if ($ClearCache) {
    Write-Host "=== PASO 3: LIMPIANDO CACHE ===" -ForegroundColor Cyan
    if (Test-Path "node_modules\.cache") {
        Remove-Item "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "OK - Cache limpiado" -ForegroundColor Green
    }
    Write-Host ""
}

# PASO 4: INSTALAR DEPENDENCIAS
if (-not $SkipInstall) {
    Write-Host "=== PASO 4: INSTALANDO DEPENDENCIAS ===" -ForegroundColor Cyan
    if (Test-Path "node_modules") {
        Write-Host "node_modules ya existe" -ForegroundColor Yellow
        $response = Read-Host "Reinstalar? (y/N)"
        if ($response -eq "y" -or $response -eq "Y") {
            Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
            Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
            Write-Host "Instalando..." -ForegroundColor Yellow
            & npm install
        }
    } else {
        Write-Host "Instalando dependencias..." -ForegroundColor Yellow
        & npm install
    }
    Write-Host ""
}

# PASO 5: DETECTAR PUERTO
$MockPort = 3001
if (-not $SkipMock) {
    Write-Host "=== PASO 5: DETECTANDO PUERTO ===" -ForegroundColor Cyan
    for ($port = 3001; $port -le 3010; $port++) {
        try {
            $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
            if (-not $connection.TcpTestSucceeded) {
                $MockPort = $port
                Write-Host "OK - Puerto $MockPort disponible" -ForegroundColor Green
                break
            }
        } catch {
            $MockPort = $port
            Write-Host "OK - Usando puerto $MockPort" -ForegroundColor Green
            break
        }
    }
    Write-Host ""
}

# PASO 6: INICIAR SERVICIOS
Write-Host "=== PASO 6: INICIANDO SERVICIOS ===" -ForegroundColor Cyan
Write-Host ""

if (-not $SkipMock) {
    Write-Host "Iniciando json-server en puerto $MockPort..." -ForegroundColor Yellow
    
    try {
        $jsonJob = Start-Job -Name "json-server" -ScriptBlock {
            param($port)
            & npx json-server --watch db.json --port $port --host 0.0.0.0
        } -ArgumentList $MockPort
        
        Start-Sleep -Seconds 3
        
        $job = Get-Job -Name "json-server" -ErrorAction SilentlyContinue
        if ($job -and $job.State -eq "Running") {
            Write-Host "OK - json-server iniciado" -ForegroundColor Green
            Write-Host "      Accesible en: http://localhost:$MockPort" -ForegroundColor Gray
        } else {
            Write-Host "AVISO - json-server puede no haberse iniciado" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "AVISO - Error al iniciar json-server" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Iniciando Expo..." -ForegroundColor Yellow
Write-Host ""

$expoArgs = @("start")
if ($ClearCache) { $expoArgs += "--clear" }
if ($AndroidOnly) { $expoArgs += "--android" }

& expo $expoArgs

# Limpiar
Write-Host ""
$job = Get-Job -Name "json-server" -ErrorAction SilentlyContinue
if ($job) {
    Stop-Job -Name "json-server" -ErrorAction SilentlyContinue
    Remove-Job -Name "json-server" -ErrorAction SilentlyContinue
    Write-Host "OK - json-server detenido" -ForegroundColor Green
}

Write-Host "Finalizado" -ForegroundColor Green
