# BURBUJAPP - Script para detener entorno de desarrollo

param(
    [switch]$Force,  # Forzar cierre de procesos
    [switch]$Help    # Mostrar ayuda
)

if ($Help) {
    Write-Host "BURBUJAPP - Script para Detener Desarrollo"
    Write-Host ""
    Write-Host "USO: .\stop-dev.ps1 [opciones]"
    Write-Host ""
    Write-Host "OPCIONES:"
    Write-Host "  -Force    Fuerza el cierre de todos los procesos relacionados"
    Write-Host "  -Help     Muestra esta ayuda"
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " BURBUJAPP - Deteniendo Entorno de Desarrollo" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Función para detener procesos por puerto
function Stop-PortProcess {
    param([int]$Port, [string]$Name)
    
    Write-Host "Deteniendo procesos en puerto $Port ($Name)..." -ForegroundColor Yellow
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($pid in $processes) {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "  Deteniendo PID: $pid ($($process.ProcessName))" -ForegroundColor Yellow
                if ($Force) {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                } else {
                    Stop-Process -Id $pid -ErrorAction SilentlyContinue
                }
                Write-Host "  Proceso detenido" -ForegroundColor Green
            }
        }
    } catch {
        Write-Host "  No se encontraron procesos en puerto $Port" -ForegroundColor Yellow
    }
}

# Detener servicios principales
Stop-PortProcess -Port 3001 -Name "JSON Server"
Stop-PortProcess -Port 8081 -Name "Expo Dev Server"
Stop-PortProcess -Port 19000 -Name "Expo Metro"
Stop-PortProcess -Port 19001 -Name "Expo DevTools"

Write-Host ""
Write-Host "Limpiando archivos temporales..." -ForegroundColor Yellow

# Limpiar logs
if (Test-Path "logs") {
    Remove-Item "logs\*.log" -Force -ErrorAction SilentlyContinue
    Write-Host "  Logs limpiados" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " Entorno de desarrollo detenido" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
