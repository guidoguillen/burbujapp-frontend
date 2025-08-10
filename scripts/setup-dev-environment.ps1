# BURBUJAPP - Script de Instalación Completa del Entorno de Desarrollo
# Este script configura todo lo necesario para desarrollar en BurbujApp

param(
    [switch]$SkipNodeCheck,    # Omitir verificación de Node.js
    [switch]$SkipGitCheck,     # Omitir verificación de Git
    [switch]$InstallExtensions, # Instalar extensiones recomendadas de VS Code
    [switch]$Help              # Mostrar ayuda
)

if ($Help) {
    Write-Host "BURBUJAPP - Script de Instalacion Completa"
    Write-Host ""
    Write-Host "USO: .\setup-dev-environment.ps1 [opciones]"
    Write-Host ""
    Write-Host "OPCIONES:"
    Write-Host "  -SkipNodeCheck      Omitir verificacion de Node.js"
    Write-Host "  -SkipGitCheck       Omitir verificacion de Git"
    Write-Host "  -InstallExtensions  Instalar extensiones de VS Code"
    Write-Host "  -Help               Mostrar esta ayuda"
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " BURBUJAPP - Configurando Entorno de Desarrollo" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: No se encuentra package.json" -ForegroundColor Red
    Write-Host "Ejecutar este script desde la raiz del proyecto BurbujApp" -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando configuracion del entorno de desarrollo..." -ForegroundColor Green
Write-Host ""

# =================== VERIFICACIONES DE PREREQUISITOS ===================

Write-Host "1. Verificando prerequisitos del sistema..." -ForegroundColor Yellow

# Verificar Node.js
if (-not $SkipNodeCheck) {
    Write-Host "   Verificando Node.js..." -ForegroundColor White
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "   ✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
            
            # Verificar versión mínima (se recomienda 18+)
            $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
            if ($versionNumber -lt 18) {
                Write-Host "   ⚠ ADVERTENCIA: Node.js $nodeVersion detectado" -ForegroundColor Yellow
                Write-Host "     Se recomienda Node.js 18+ para mejor compatibilidad" -ForegroundColor Yellow
            }
        } else {
            throw "Node.js no encontrado"
        }
    } catch {
        Write-Host "   ❌ Node.js no esta instalado" -ForegroundColor Red
        Write-Host "     Descarga e instala desde: https://nodejs.org/" -ForegroundColor Red
        Write-Host "     Se recomienda la version LTS (Long Term Support)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ⏭ Verificacion de Node.js omitida" -ForegroundColor Yellow
}

# Verificar npm
Write-Host "   Verificando npm..." -ForegroundColor White
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "   ✓ npm encontrado: v$npmVersion" -ForegroundColor Green
    } else {
        throw "npm no encontrado"
    }
} catch {
    Write-Host "   ❌ npm no esta disponible" -ForegroundColor Red
    Write-Host "     npm viene incluido con Node.js" -ForegroundColor Red
    exit 1
}

# Verificar Git
if (-not $SkipGitCheck) {
    Write-Host "   Verificando Git..." -ForegroundColor White
    try {
        $gitVersion = git --version 2>$null
        if ($gitVersion) {
            Write-Host "   ✓ Git encontrado: $gitVersion" -ForegroundColor Green
        } else {
            throw "Git no encontrado"
        }
    } catch {
        Write-Host "   ⚠ Git no esta instalado" -ForegroundColor Yellow
        Write-Host "     Descarga desde: https://git-scm.com/" -ForegroundColor Yellow
        Write-Host "     Git es recomendado para control de versiones" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⏭ Verificacion de Git omitida" -ForegroundColor Yellow
}

# Verificar Expo CLI
Write-Host "   Verificando Expo CLI..." -ForegroundColor White
try {
    $expoVersion = npx expo --version 2>$null
    if ($expoVersion) {
        Write-Host "   ✓ Expo CLI disponible: v$expoVersion" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Expo CLI no encontrado, se instalara automaticamente" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ Expo CLI no disponible, se instalara cuando sea necesario" -ForegroundColor Yellow
}

Write-Host ""

# =================== INSTALACION DE DEPENDENCIAS ===================

Write-Host "2. Instalando dependencias del proyecto..." -ForegroundColor Yellow

# Limpiar instalaciones previas si existen
if (Test-Path "node_modules") {
    Write-Host "   Limpiando instalacion previa..." -ForegroundColor White
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
}

if (Test-Path "package-lock.json") {
    Write-Host "   Limpiando package-lock.json..." -ForegroundColor White
    Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
}

# Instalar dependencias principales
Write-Host "   Instalando dependencias principales..." -ForegroundColor White
try {
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Dependencias principales instaladas" -ForegroundColor Green
    } else {
        throw "Error en instalacion principal"
    }
} catch {
    Write-Host "   ❌ Error instalando dependencias principales" -ForegroundColor Red
    Write-Host "     Intentando con cache limpio..." -ForegroundColor Yellow
    
    npm cache clean --force
    npm install --legacy-peer-deps --verbose
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Fallo la instalacion de dependencias" -ForegroundColor Red
        exit 1
    }
}

# Instalar dependencias de desarrollo adicionales
Write-Host "   Instalando herramientas de desarrollo..." -ForegroundColor White
$devDependencies = @(
    "json-server",
    "@types/node"
)

foreach ($dep in $devDependencies) {
    try {
        Write-Host "     Instalando $dep..." -ForegroundColor Gray
        npm install -D $dep --legacy-peer-deps --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "     ✓ $dep instalado" -ForegroundColor Green
        }
    } catch {
        Write-Host "     ⚠ Error instalando $dep (no critico)" -ForegroundColor Yellow
    }
}

Write-Host ""

# =================== CONFIGURACION DE ARCHIVOS ===================

Write-Host "3. Configurando archivos del entorno..." -ForegroundColor Yellow

# Crear directorios necesarios
$directories = @("logs", "temp", ".expo")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   ✓ Directorio '$dir' creado" -ForegroundColor Green
    }
}

# Verificar archivos de configuracion clave
$configFiles = @(
    "app.json",
    "babel.config.js",
    "tsconfig.json",
    "package.json",
    "db.json"
)

Write-Host "   Verificando archivos de configuracion..." -ForegroundColor White
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ $file faltante" -ForegroundColor Yellow
    }
}

# Configurar variables de entorno locales
Write-Host "   Configurando variables de entorno..." -ForegroundColor White

# Obtener IP local automáticamente
try {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue).IPAddress
    if (-not $localIP) {
        $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" })[0].IPAddress
    }
    
    if ($localIP) {
        Write-Host "   ✓ IP local detectada: $localIP" -ForegroundColor Green
        
        # Actualizar IpConfig.ts si existe
        if (Test-Path "src/services/config/IpConfig.ts") {
            $ipConfigContent = Get-Content "src/services/config/IpConfig.ts" -Raw
            $newIpConfigContent = $ipConfigContent -replace "export const LOCAL_IP = '[^']+';", "export const LOCAL_IP = '$localIP';"
            Set-Content "src/services/config/IpConfig.ts" -Value $newIpConfigContent
            Write-Host "   ✓ IP configurada en IpConfig.ts" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠ No se pudo detectar IP local automaticamente" -ForegroundColor Yellow
        Write-Host "     Configurar manualmente en src/services/config/IpConfig.ts" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ Error detectando IP local" -ForegroundColor Yellow
}

Write-Host ""

# =================== VERIFICACION DE FUNCIONAMIENTO ===================

Write-Host "4. Verificando funcionamiento del entorno..." -ForegroundColor Yellow

# Verificar que TypeScript compile
Write-Host "   Verificando compilacion TypeScript..." -ForegroundColor White
try {
    npx tsc --noEmit --skipLibCheck
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ TypeScript compila correctamente" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Advertencias en TypeScript (no critico)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ Error verificando TypeScript" -ForegroundColor Yellow
}

# Probar JSON Server
Write-Host "   Probando JSON Server..." -ForegroundColor White
try {
    # Iniciar JSON Server en background para probar
    $jsonServerJob = Start-Job -ScriptBlock {
        Set-Location $args[0]
        npm run mock-api-fast
    } -ArgumentList (Get-Location)
    
    Start-Sleep -Seconds 5
    
    # Probar endpoint
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/clientes" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ JSON Server funciona correctamente" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠ JSON Server no responde (verificar manualmente)" -ForegroundColor Yellow
    }
    
    # Detener JSON Server
    Stop-Job $jsonServerJob -Force 2>$null
    Remove-Job $jsonServerJob -Force 2>$null
} catch {
    Write-Host "   ⚠ Error probando JSON Server" -ForegroundColor Yellow
}

Write-Host ""

# =================== INSTALACION DE EXTENSIONES VS CODE ===================

if ($InstallExtensions) {
    Write-Host "5. Instalando extensiones recomendadas de VS Code..." -ForegroundColor Yellow
    
    # Verificar si VS Code esta instalado
    try {
        $codeVersion = code --version 2>$null
        if ($codeVersion) {
            Write-Host "   ✓ VS Code encontrado" -ForegroundColor Green
            
            $extensions = @(
                "ms-vscode.vscode-typescript-next",
                "bradlc.vscode-tailwindcss", 
                "ms-vscode.vscode-json",
                "esbenp.prettier-vscode",
                "ms-vscode.vscode-eslint",
                "formulahendry.auto-rename-tag",
                "ms-vscode.vscode-react-native"
            )
            
            foreach ($ext in $extensions) {
                Write-Host "   Instalando extension: $ext..." -ForegroundColor White
                code --install-extension $ext --force 2>$null
            }
            
            Write-Host "   ✓ Extensiones instaladas" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ VS Code no encontrado, omitiendo extensiones" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠ No se pudieron instalar extensiones de VS Code" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# =================== RESUMEN FINAL ===================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " CONFIGURACION COMPLETADA" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Entorno de desarrollo configurado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "COMANDOS DISPONIBLES:" -ForegroundColor Cyan
Write-Host "  npm run dev          - Iniciar entorno completo" -ForegroundColor White
Write-Host "  npm run dev:fast     - Iniciar con API rapida" -ForegroundColor White
Write-Host "  npm run dev:stop     - Detener servicios" -ForegroundColor White
Write-Host "  npm run mock-api     - Solo JSON Server" -ForegroundColor White
Write-Host "  npm start            - Solo Expo" -ForegroundColor White
Write-Host ""
Write-Host "URLS IMPORTANTES:" -ForegroundColor Cyan
Write-Host "  JSON Server: http://localhost:3001" -ForegroundColor White
Write-Host "  Expo Metro:  http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "ARCHIVOS DE CONFIGURACION:" -ForegroundColor Cyan
Write-Host "  src/services/config/IpConfig.ts  - Configuracion de red" -ForegroundColor White
Write-Host "  db.json                          - Base de datos mock" -ForegroundColor White
Write-Host "  DEV_QUICK_START.md               - Guia de inicio rapido" -ForegroundColor White
Write-Host ""
Write-Host "PROXIMO PASO:" -ForegroundColor Yellow
Write-Host "  Ejecuta: npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
