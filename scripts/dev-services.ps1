# Script para manejar json-server y expo independientemente
# Uso: .\dev-services.ps1 -Action [start|stop|restart] [-Target [all|expo|api]]

param(
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action = "status",
    
    [ValidateSet("all", "expo", "api")]
    [string]$Target = "all",
    
    [int]$Port = 3001
)

# Variables de color
$Colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "Cyan"
    Section = "Magenta"
}

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    Write-Host $Message -ForegroundColor $Colors[$Type]
}

function Get-ServiceStatus {
    param([string]$ServiceName)
    
    switch ($ServiceName) {
        "json-server" {
            $job = Get-Job -Name $ServiceName -ErrorAction SilentlyContinue
            if ($job) {
                if ($job.State -eq "Running") {
                    Write-Status "✅ json-server en ejecución (Job ID: $($job.Id))" "Success"
                } else {
                    Write-Status "⚠️  json-server detenido ($($job.State))" "Warning"
                }
            } else {
                Write-Status "❌ json-server no iniciado" "Error"
            }
            return $job
        }
        "expo" {
            $expoProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*expo*" }
            if ($expoProcess) {
                Write-Status "✅ expo en ejecución (PID: $($expoProcess.Id))" "Success"
            } else {
                Write-Status "❌ expo no iniciado" "Error"
            }
            return $expoProcess
        }
    }
}

function Start-Service {
    param([string]$ServiceName)
    
    switch ($ServiceName) {
        "api" {
            Write-Status "Iniciando json-server en puerto $Port..." "Info"
            
            # Verificar si ya está corriendo
            if (Get-Job -Name "json-server" -ErrorAction SilentlyContinue) {
                Write-Status "⚠️  json-server ya está en ejecución" "Warning"
                return
            }
            
            # Iniciar json-server
            $jsonServerJob = Start-Job -Name "json-server" -ScriptBlock {
                param($port)
                & npx json-server --watch db.json --port $port --host 0.0.0.0 2>&1
            } -ArgumentList $Port
            
            Start-Sleep -Seconds 2
            
            # Verificar si se inició correctamente
            if ($jsonServerJob.State -eq "Running") {
                Write-Status "✅ json-server iniciado correctamente (Job ID: $($jsonServerJob.Id))" "Success"
                Write-Status "   Accesible en: http://localhost:$Port" "Info"
            } else {
                Write-Status "❌ Error al iniciar json-server" "Error"
            }
        }
        "expo" {
            Write-Status "Iniciando expo..." "Info"
            & expo start
        }
    }
}

function Stop-Service {
    param([string]$ServiceName)
    
    switch ($ServiceName) {
        "api" {
            Write-Status "Deteniendo json-server..." "Info"
            
            $job = Get-Job -Name "json-server" -ErrorAction SilentlyContinue
            if ($job) {
                Stop-Job -Name "json-server"
                Remove-Job -Name "json-server"
                Write-Status "✅ json-server detenido" "Success"
            } else {
                Write-Status "⚠️  json-server no estaba en ejecución" "Warning"
            }
        }
        "expo" {
            Write-Status "Deteniendo expo..." "Info"
            
            Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*expo*" } | Stop-Process -Force
            Write-Status "✅ expo detenido" "Success"
        }
    }
}

# Ejecutar acción
Write-Host ""
Write-Status "═══════════════════════════════════════════════════════════════" "Section"

switch ($Action) {
    "status" {
        Write-Status "Estado de servicios:" "Section"
        Write-Host ""
        
        if ($Target -eq "all" -or $Target -eq "api") {
            Write-Status "json-server:" "Info"
            Get-ServiceStatus "json-server"
            Write-Host ""
        }
        
        if ($Target -eq "all" -or $Target -eq "expo") {
            Write-Status "expo:" "Info"
            Get-ServiceStatus "expo"
            Write-Host ""
        }
    }
    
    "start" {
        Write-Status "Iniciando servicios..." "Section"
        Write-Host ""
        
        if ($Target -eq "all" -or $Target -eq "api") {
            Start-Service "api"
            Write-Host ""
        }
        
        if ($Target -eq "all" -or $Target -eq "expo") {
            Start-Service "expo"
        }
    }
    
    "stop" {
        Write-Status "Deteniendo servicios..." "Section"
        Write-Host ""
        
        if ($Target -eq "all" -or $Target -eq "api") {
            Stop-Service "api"
        }
        
        if ($Target -eq "all" -or $Target -eq "expo") {
            Stop-Service "expo"
        }
        Write-Host ""
    }
    
    "restart" {
        Write-Status "Reiniciando servicios..." "Section"
        Write-Host ""
        
        if ($Target -eq "all" -or $Target -eq "api") {
            Stop-Service "api"
            Start-Sleep -Seconds 1
            Start-Service "api"
            Write-Host ""
        }
        
        if ($Target -eq "all" -or $Target -eq "expo") {
            Stop-Service "expo"
            Start-Sleep -Seconds 1
            Write-Status "Nota: Ejecuta nuevamente con -Target expo para iniciar" "Warning"
        }
    }
}

Write-Status "═══════════════════════════════════════════════════════════════" "Section"
Write-Host ""
