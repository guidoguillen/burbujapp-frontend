# BURBUJAPP - Script de Clonado e Instalación Completa
# Este script clona el repositorio y configura todo el entorno desde cero

param(
    [string]$GitUrl = "https://github.com/guidoguillen/burbujapp-frontend.git",
    [string]$ProjectFolder = "burbujapp-frontend",
    [switch]$SkipClone,        # Omitir clonado (si ya tienes el proyecto)
    [switch]$InstallExtensions, # Instalar extensiones de VS Code
    [switch]$Help              # Mostrar ayuda
)

if ($Help) {
    Write-Host "BURBUJAPP - Script de Clonado e Instalacion Completa"
    Write-Host ""
    Write-Host "USO: .\clone-and-setup.ps1 [opciones]"
    Write-Host ""
    Write-Host "OPCIONES:"
    Write-Host "  -GitUrl <url>           URL del repositorio Git"
    Write-Host "  -ProjectFolder <name>   Nombre de la carpeta del proyecto"
    Write-Host "  -SkipClone              Omitir clonado (usar proyecto existente)"
    Write-Host "  -InstallExtensions      Instalar extensiones de VS Code"
    Write-Host "  -Help                   Mostrar esta ayuda"
    Write-Host ""
    Write-Host "EJEMPLOS:"
    Write-Host "  .\clone-and-setup.ps1"
    Write-Host "  .\clone-and-setup.ps1 -InstallExtensions"
    Write-Host "  .\clone-and-setup.ps1 -SkipClone"
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " BURBUJAPP - Instalacion Completa del Entorno" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Configurando entorno de desarrollo completo para BurbujApp..." -ForegroundColor Green
Write-Host ""

# =================== VERIFICACIONES INICIALES ===================

Write-Host "1. Verificando herramientas del sistema..." -ForegroundColor Yellow

# Verificar Git
if (-not $SkipClone) {
    Write-Host "   Verificando Git..." -ForegroundColor White
    try {
        $gitVersion = git --version 2>$null
        if ($gitVersion) {
            Write-Host "   ✓ Git encontrado: $gitVersion" -ForegroundColor Green
        } else {
            throw "Git no encontrado"
        }
    } catch {
        Write-Host "   ❌ Git no esta instalado" -ForegroundColor Red
        Write-Host "     Descarga e instala desde: https://git-scm.com/" -ForegroundColor Red
        Write-Host "     Git es necesario para clonar el repositorio" -ForegroundColor Red
        exit 1
    }
}

# Verificar Node.js
Write-Host "   Verificando Node.js..." -ForegroundColor White
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   ✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
        
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
    exit 1
}

Write-Host ""

# =================== CLONADO DEL REPOSITORIO ===================

if (-not $SkipClone) {
    Write-Host "2. Clonando repositorio..." -ForegroundColor Yellow
    
    # Verificar si la carpeta ya existe
    if (Test-Path $ProjectFolder) {
        Write-Host "   ⚠ La carpeta '$ProjectFolder' ya existe" -ForegroundColor Yellow
        $response = Read-Host "   ¿Deseas eliminarla y clonar de nuevo? (s/N)"
        if ($response -eq 's' -or $response -eq 'S') {
            Remove-Item $ProjectFolder -Recurse -Force
            Write-Host "   Carpeta eliminada" -ForegroundColor Yellow
        } else {
            Write-Host "   Usando carpeta existente..." -ForegroundColor Yellow
            $SkipClone = $true
        }
    }
    
    if (-not $SkipClone) {
        Write-Host "   Clonando desde: $GitUrl" -ForegroundColor White
        try {
            git clone $GitUrl $ProjectFolder
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   ✓ Repositorio clonado exitosamente" -ForegroundColor Green
            } else {
                throw "Error en git clone"
            }
        } catch {
            Write-Host "   ❌ Error clonando repositorio" -ForegroundColor Red
            Write-Host "     Verifica la URL: $GitUrl" -ForegroundColor Red
            Write-Host "     Verifica tu conexion a internet" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host ""
}

# =================== CAMBIAR AL DIRECTORIO DEL PROYECTO ===================

Write-Host "3. Configurando directorio de trabajo..." -ForegroundColor Yellow

if (Test-Path $ProjectFolder) {
    Set-Location $ProjectFolder
    Write-Host "   ✓ Cambiado al directorio: $ProjectFolder" -ForegroundColor Green
} else {
    Write-Host "   ❌ No se encuentra la carpeta del proyecto: $ProjectFolder" -ForegroundColor Red
    exit 1
}

# Verificar que es un proyecto BurbujApp válido
if (-not (Test-Path "package.json")) {
    Write-Host "   ❌ No se encuentra package.json en el proyecto" -ForegroundColor Red
    Write-Host "     Verifica que el repositorio sea correcto" -ForegroundColor Red
    exit 1
}

$packageContent = Get-Content "package.json" -Raw | ConvertFrom-Json
if ($packageContent.name -eq "burbuja-app") {
    Write-Host "   ✓ Proyecto BurbujApp validado" -ForegroundColor Green
} else {
    Write-Host "   ⚠ El proyecto podria no ser BurbujApp (nombre: $($packageContent.name))" -ForegroundColor Yellow
}

Write-Host ""

# =================== EJECUTAR SETUP DEL ENTORNO ===================

Write-Host "4. Configurando entorno de desarrollo..." -ForegroundColor Yellow

# Verificar si existe el script de setup
if (Test-Path "scripts\setup-dev-environment.ps1") {
    Write-Host "   Ejecutando script de configuracion..." -ForegroundColor White
    
    $setupArgs = @()
    if ($InstallExtensions) {
        $setupArgs += "-InstallExtensions"
    }
    
    # Ejecutar script de setup
    try {
        & ".\scripts\setup-dev-environment.ps1" @setupArgs
        Write-Host "   ✓ Configuracion del entorno completada" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Error en la configuracion del entorno" -ForegroundColor Red
        Write-Host "     Error: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ⚠ Script de setup no encontrado" -ForegroundColor Yellow
    Write-Host "     Ejecutando configuracion basica..." -ForegroundColor Yellow
    
    # Configuración básica manual
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
    
    npm install -D json-server --legacy-peer-deps
    Write-Host "   ✓ Configuracion basica completada" -ForegroundColor Green
}

Write-Host ""

# =================== VERIFICACION FINAL ===================

Write-Host "5. Verificacion final..." -ForegroundColor Yellow

# Probar que todo funcione
Write-Host "   Verificando funcionamiento..." -ForegroundColor White

try {
    # Verificar scripts disponibles
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $scripts = $packageJson.scripts
    
    if ($scripts.dev) {
        Write-Host "   ✓ Script 'npm run dev' disponible" -ForegroundColor Green
    }
    
    if ($scripts.'mock-api') {
        Write-Host "   ✓ Script 'npm run mock-api' disponible" -ForegroundColor Green
    }
    
    if (Test-Path "db.json") {
        Write-Host "   ✓ Base de datos mock (db.json) encontrada" -ForegroundColor Green
    }
    
    # Verificar TypeScript
    if (Test-Path "tsconfig.json") {
        Write-Host "   ✓ Configuracion TypeScript encontrada" -ForegroundColor Green
    }
    
} catch {
    Write-Host "   ⚠ Error en verificacion (no critico)" -ForegroundColor Yellow
}

Write-Host ""

# =================== RESUMEN FINAL ===================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " INSTALACION COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎉 BurbujApp esta listo para desarrollo!" -ForegroundColor Green
Write-Host ""
Write-Host "UBICACION DEL PROYECTO:" -ForegroundColor Cyan
Write-Host "  $(Get-Location)" -ForegroundColor White
Write-Host ""
Write-Host "COMANDOS PRINCIPALES:" -ForegroundColor Cyan
Write-Host "  npm run dev          - Iniciar entorno completo (JSON Server + Expo)" -ForegroundColor White
Write-Host "  npm run dev:fast     - Iniciar con API rapida" -ForegroundColor White
Write-Host "  npm run dev:stop     - Detener todos los servicios" -ForegroundColor White
Write-Host "  npm start            - Solo Expo Dev Server" -ForegroundColor White
Write-Host "  npm run mock-api     - Solo JSON Server" -ForegroundColor White
Write-Host ""
Write-Host "URLS IMPORTANTES:" -ForegroundColor Cyan
Write-Host "  JSON Server (Mock API): http://localhost:3001" -ForegroundColor White
Write-Host "  Expo Dev Server:        http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "ARCHIVOS CLAVE:" -ForegroundColor Cyan
Write-Host "  DEV_QUICK_START.md               - Guia de inicio rapido" -ForegroundColor White
Write-Host "  JSON_SERVER_README.md            - Documentacion de la API mock" -ForegroundColor White
Write-Host "  SCRIPTS_README.md                - Documentacion de scripts" -ForegroundColor White
Write-Host "  src/services/config/IpConfig.ts  - Configuracion de red" -ForegroundColor White
Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "  cd $ProjectFolder" -ForegroundColor Green
Write-Host "  npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan

# Opción de abrir VS Code automáticamente
if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Host ""
    $openVSCode = Read-Host "¿Deseas abrir el proyecto en VS Code? (s/N)"
    if ($openVSCode -eq 's' -or $openVSCode -eq 'S') {
        Write-Host "Abriendo VS Code..." -ForegroundColor Green
        code .
    }
}
