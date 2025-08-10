#!/bin/bash

# BURBUJAPP - Script de Instalación Completa del Entorno de Desarrollo
# Compatible con Linux y macOS

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN} BURBUJAPP - Configurando Entorno de Desarrollo${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}ERROR: No se encuentra package.json${NC}"
    echo -e "${RED}Ejecutar este script desde la raiz del proyecto BurbujApp${NC}"
    exit 1
fi

echo -e "${GREEN}Iniciando configuracion del entorno de desarrollo...${NC}"
echo ""

# =================== VERIFICACIONES DE PREREQUISITOS ===================

echo -e "${YELLOW}1. Verificando prerequisitos del sistema...${NC}"

# Verificar Node.js
echo -e "${WHITE}   Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}   ✓ Node.js encontrado: $NODE_VERSION${NC}"
    
    # Verificar versión mínima
    NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${YELLOW}   ⚠ ADVERTENCIA: Node.js $NODE_VERSION detectado${NC}"
        echo -e "${YELLOW}     Se recomienda Node.js 18+ para mejor compatibilidad${NC}"
    fi
else
    echo -e "${RED}   ❌ Node.js no esta instalado${NC}"
    echo -e "${RED}     Instalar desde: https://nodejs.org/${NC}"
    echo -e "${RED}     O usar un gestor de versiones como nvm${NC}"
    exit 1
fi

# Verificar npm
echo -e "${WHITE}   Verificando npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}   ✓ npm encontrado: v$NPM_VERSION${NC}"
else
    echo -e "${RED}   ❌ npm no esta disponible${NC}"
    echo -e "${RED}     npm viene incluido con Node.js${NC}"
    exit 1
fi

# Verificar Git
echo -e "${WHITE}   Verificando Git...${NC}"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}   ✓ Git encontrado: $GIT_VERSION${NC}"
else
    echo -e "${YELLOW}   ⚠ Git no esta instalado${NC}"
    echo -e "${YELLOW}     Instalar con: sudo apt install git (Ubuntu) o brew install git (macOS)${NC}"
fi

# Verificar Expo CLI
echo -e "${WHITE}   Verificando Expo CLI...${NC}"
if npx expo --version &> /dev/null; then
    EXPO_VERSION=$(npx expo --version 2>/dev/null)
    echo -e "${GREEN}   ✓ Expo CLI disponible: v$EXPO_VERSION${NC}"
else
    echo -e "${YELLOW}   ⚠ Expo CLI se instalara automaticamente cuando sea necesario${NC}"
fi

echo ""

# =================== INSTALACION DE DEPENDENCIAS ===================

echo -e "${YELLOW}2. Instalando dependencias del proyecto...${NC}"

# Limpiar instalaciones previas
if [ -d "node_modules" ]; then
    echo -e "${WHITE}   Limpiando instalacion previa...${NC}"
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo -e "${WHITE}   Limpiando package-lock.json...${NC}"
    rm -f package-lock.json
fi

# Instalar dependencias principales
echo -e "${WHITE}   Instalando dependencias principales...${NC}"
if npm install --legacy-peer-deps; then
    echo -e "${GREEN}   ✓ Dependencias principales instaladas${NC}"
else
    echo -e "${RED}   ❌ Error instalando dependencias principales${NC}"
    echo -e "${YELLOW}     Intentando con cache limpio...${NC}"
    
    npm cache clean --force
    if npm install --legacy-peer-deps --verbose; then
        echo -e "${GREEN}   ✓ Dependencias instaladas despues de limpiar cache${NC}"
    else
        echo -e "${RED}   ❌ Fallo la instalacion de dependencias${NC}"
        exit 1
    fi
fi

# Instalar dependencias de desarrollo adicionales
echo -e "${WHITE}   Instalando herramientas de desarrollo...${NC}"
DEV_DEPS=("json-server" "@types/node")

for dep in "${DEV_DEPS[@]}"; do
    echo -e "${WHITE}     Instalando $dep...${NC}"
    if npm install -D "$dep" --legacy-peer-deps --silent; then
        echo -e "${GREEN}     ✓ $dep instalado${NC}"
    else
        echo -e "${YELLOW}     ⚠ Error instalando $dep (no critico)${NC}"
    fi
done

echo ""

# =================== CONFIGURACION DE ARCHIVOS ===================

echo -e "${YELLOW}3. Configurando archivos del entorno...${NC}"

# Crear directorios necesarios
DIRECTORIES=("logs" "temp" ".expo")
for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "${GREEN}   ✓ Directorio '$dir' creado${NC}"
    fi
done

# Verificar archivos de configuracion clave
CONFIG_FILES=("app.json" "babel.config.js" "tsconfig.json" "package.json" "db.json")

echo -e "${WHITE}   Verificando archivos de configuracion...${NC}"
for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✓ $file encontrado${NC}"
    else
        echo -e "${YELLOW}   ⚠ $file faltante${NC}"
    fi
done

# Configurar IP local
echo -e "${WHITE}   Configurando IP local...${NC}"

# Detectar IP local
if command -v ip &> /dev/null; then
    # Linux
    LOCAL_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}' 2>/dev/null)
elif command -v ifconfig &> /dev/null; then
    # macOS
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
fi

if [ -n "$LOCAL_IP" ]; then
    echo -e "${GREEN}   ✓ IP local detectada: $LOCAL_IP${NC}"
    
    # Actualizar IpConfig.ts si existe
    if [ -f "src/services/config/IpConfig.ts" ]; then
        sed -i.bak "s/export const LOCAL_IP = '[^']*';/export const LOCAL_IP = '$LOCAL_IP';/" src/services/config/IpConfig.ts
        echo -e "${GREEN}   ✓ IP configurada en IpConfig.ts${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠ No se pudo detectar IP local automaticamente${NC}"
    echo -e "${YELLOW}     Configurar manualmente en src/services/config/IpConfig.ts${NC}"
fi

echo ""

# =================== VERIFICACION DE FUNCIONAMIENTO ===================

echo -e "${YELLOW}4. Verificando funcionamiento del entorno...${NC}"

# Verificar TypeScript
echo -e "${WHITE}   Verificando compilacion TypeScript...${NC}"
if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
    echo -e "${GREEN}   ✓ TypeScript compila correctamente${NC}"
else
    echo -e "${YELLOW}   ⚠ Advertencias en TypeScript (no critico)${NC}"
fi

# Probar JSON Server
echo -e "${WHITE}   Probando JSON Server...${NC}"
if npm run mock-api-fast &>/dev/null &
then
    JSON_PID=$!
    sleep 5
    
    if curl -s http://localhost:3001/clientes &>/dev/null; then
        echo -e "${GREEN}   ✓ JSON Server funciona correctamente${NC}"
    else
        echo -e "${YELLOW}   ⚠ JSON Server no responde (verificar manualmente)${NC}"
    fi
    
    # Detener JSON Server
    kill $JSON_PID 2>/dev/null || true
    wait $JSON_PID 2>/dev/null || true
else
    echo -e "${YELLOW}   ⚠ Error probando JSON Server${NC}"
fi

echo ""

# =================== CONFIGURACION DE PERMISOS ===================

echo -e "${YELLOW}5. Configurando permisos...${NC}"

# Hacer ejecutables los scripts
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x *.sh 2>/dev/null || true

echo -e "${GREEN}   ✓ Permisos configurados${NC}"

echo ""

# =================== RESUMEN FINAL ===================

echo -e "${CYAN}================================================================${NC}"
echo -e "${GREEN} CONFIGURACION COMPLETADA${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

echo -e "${GREEN}Entorno de desarrollo configurado exitosamente!${NC}"
echo ""
echo -e "${CYAN}COMANDOS DISPONIBLES:${NC}"
echo -e "${WHITE}  npm run dev          - Iniciar entorno completo${NC}"
echo -e "${WHITE}  npm run dev:fast     - Iniciar con API rapida${NC}"
echo -e "${WHITE}  npm run dev:stop     - Detener servicios${NC}"
echo -e "${WHITE}  npm run mock-api     - Solo JSON Server${NC}"
echo -e "${WHITE}  npm start            - Solo Expo${NC}"
echo ""
echo -e "${CYAN}URLS IMPORTANTES:${NC}"
echo -e "${WHITE}  JSON Server: http://localhost:3001${NC}"
echo -e "${WHITE}  Expo Metro:  http://localhost:8081${NC}"
echo ""
echo -e "${CYAN}ARCHIVOS DE CONFIGURACION:${NC}"
echo -e "${WHITE}  src/services/config/IpConfig.ts  - Configuracion de red${NC}"
echo -e "${WHITE}  db.json                          - Base de datos mock${NC}"
echo -e "${WHITE}  DEV_QUICK_START.md               - Guia de inicio rapido${NC}"
echo ""
echo -e "${YELLOW}PROXIMO PASO:${NC}"
echo -e "${GREEN}  Ejecuta: npm run dev${NC}"
echo ""
echo -e "${CYAN}================================================================${NC}"
