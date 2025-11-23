# Script para controlar json-server independientemente
# Uso: npm run dev:api:start | dev:api:stop | dev:api:status

param(
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action = "status",
    
    [int]$Port = 3001
)

$ErrorActionPreference = "Continue"
$ProjectRoot = "c:\git\burbujapp-frontend"
$DbPath = Join-Path $ProjectRoot "db.json"

function Write-Line {
    param([string]$Message, [string]$Color = "Cyan")
    Write-Host $Message -ForegroundColor $Color
}

function Get-ApiStatus {
    # Buscar proceso json-server por el puerto
    $process = Get-Process -Name "node" -ErrorAction SilentlyContinue | 
               Where-Object { $_.CommandLine -like "*json-server*" -and $_.CommandLine -like "*$Port*" }
    
    if ($process) {
        Write-Line "[OK] json-server en ejecucion (PID: $($process.Id))" "Green"
        Write-Line "     Accesible en: http://localhost:$Port" "Gray"
        Write-Line "     Datos: $DbPath" "Gray"
    } else {
        Write-Line "[NO] json-server no iniciado" "Red"
    }
    return $process
}

function Start-Api {
    Write-Line "Iniciando json-server en puerto $Port..." "Yellow"
    
    # Verificar si ya está corriendo
    $existing = Get-Process -Name "node" -ErrorAction SilentlyContinue | 
                Where-Object { $_.CommandLine -like "*json-server*" -and $_.CommandLine -like "*$Port*" }
    
    if ($existing) {
        Write-Line "[AVISO] json-server ya esta en ejecucion (PID: $($existing.Id))" "Yellow"
        Write-Line "     Accesible en: http://localhost:$Port" "Gray"
        return
    }
    
    # Verificar que db.json existe
    if (-not (Test-Path $DbPath)) {
        Write-Line "[ERROR] db.json no encontrado en $DbPath" "Red"
        return
    }
    
    # Crear una ventana separada donde json-server corre independientemente
    $command = "cd '$ProjectRoot'; npx json-server --watch db.json --port $Port --host 0.0.0.0"
    
    try {
        Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $command -WindowStyle Normal
        Start-Sleep -Seconds 2
        
        # Verificar si se inició correctamente
        $check = Get-Process -Name "node" -ErrorAction SilentlyContinue | 
                 Where-Object { $_.CommandLine -like "*json-server*" -and $_.CommandLine -like "*$Port*" }
        
        if ($check) {
            Write-Line "[OK] json-server iniciado (PID: $($check.Id))" "Green"
            Write-Line "     Accesible en: http://localhost:$Port" "Gray"
            Write-Line "     Una ventana independiente se abrio para json-server" "Gray"
        } else {
            Write-Line "[ERROR] No se pudo iniciar json-server" "Red"
        }
    } catch {
        Write-Line "[ERROR] $($_.Exception.Message)" "Red"
    }
}

function Stop-Api {
    Write-Line "Deteniendo json-server..." "Yellow"
    
    # Buscar el proceso json-server en el puerto especificado
    $process = Get-Process -Name "node" -ErrorAction SilentlyContinue | 
               Where-Object { $_.CommandLine -like "*json-server*" -and $_.CommandLine -like "*$Port*" }
    
    if ($process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Write-Line "[OK] json-server detenido" "Green"
    } else {
        Write-Line "[AVISO] json-server no estaba en ejecucion" "Yellow"
    }
}

# Main
Write-Host ""
Write-Line "=====================================================" "Magenta"

switch ($Action) {
    "status" {
        Write-Line "Estado del servicio:" "Cyan"
        Write-Line ""
        Get-ApiStatus
    }
    
    "start" {
        Write-Line "Iniciando servicios..." "Cyan"
        Write-Line ""
        Start-Api
    }
    
    "stop" {
        Write-Line "Deteniendo servicios..." "Cyan"
        Write-Line ""
        Stop-Api
    }
    
    "restart" {
        Write-Line "Reiniciando servicios..." "Cyan"
        Write-Line ""
        Stop-Api
        Start-Sleep -Seconds 1
        Start-Api
    }
}

Write-Line "=====================================================" "Magenta"
Write-Host ""
Write-Host ""
