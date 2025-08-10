#!/bin/bash

# BURBUJAPP - Script Universal de Instalación
# Detecta automáticamente el sistema operativo y ejecuta la instalación apropiada

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Variables por defecto
GIT_URL="https://github.com/guidoguillen/burbujapp-frontend.git"
PROJECT_FOLDER="burbujapp-frontend"
SKIP_CLONE=false

# Función de ayuda
show_help() {
    echo ""
    echo -e "${CYAN}BURBUJAPP - Script Universal de Instalación${NC}"
    echo ""
    echo "USO: ./install-burbujapp.sh [opciones]"
    echo ""
    echo "OPCIONES:"
    echo "  -u, --url <url>      URL del repositorio Git"
    echo "  -f, --folder <name>  Nombre de la carpeta del proyecto"
    echo "  -s, --skip-clone     Omitir clonado (usar proyecto existente)"
    echo "  -h, --help           Mostrar esta ayuda"
    echo ""
    echo "EJEMPLOS:"
    echo "  ./install-burbujapp.sh"
    echo "  ./install-burbujapp.sh --skip-clone"
    echo "  ./install-burbujapp.sh --url https://github.com/usuario/repo.git"
    echo ""
}

# Procesar argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            GIT_URL="$2"
            shift 2
            ;;
        -f|--folder)
            PROJECT_FOLDER="$2"
            shift 2
            ;;
        -s|--skip-clone)
            SKIP_CLONE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Opción desconocida: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

echo ""
echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN} BURBUJAPP - Instalación Universal del Entorno${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

# Detectar sistema operativo
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
        echo "Windows"
    else
        echo "Unknown"
    fi
}

OS=$(detect_os)
echo -e "${GREEN}Sistema operativo detectado: $OS${NC}"
echo ""

# =================== VERIFICACIONES INICIALES ===================

echo -e "${YELLOW}1. Verificando herramientas del sistema...${NC}"

# Verificar Git
if [ "$SKIP_CLONE" = false ]; then
    echo -e "${WHITE}   Verificando Git...${NC}"
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        echo -e "${GREEN}   ✓ Git encontrado: $GIT_VERSION${NC}"
    else
        echo -e "${RED}   ❌ Git no esta instalado${NC}"
        case $OS in
            "Linux")
                echo -e "${RED}     Instalar con: sudo apt install git (Ubuntu/Debian)${NC}"
                echo -e "${RED}                   sudo yum install git (CentOS/RHEL)${NC}"
                ;;
            "macOS")
                echo -e "${RED}     Instalar con: brew install git${NC}"
                echo -e "${RED}     O descarga desde: https://git-scm.com/${NC}"
                ;;
            *)
                echo -e "${RED}     Descarga desde: https://git-scm.com/${NC}"
                ;;
        esac
        exit 1
    fi
fi

# Verificar Node.js
echo -e "${WHITE}   Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}   ✓ Node.js encontrado: $NODE_VERSION${NC}"
    
    NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${YELLOW}   ⚠ ADVERTENCIA: Node.js $NODE_VERSION detectado${NC}"
        echo -e "${YELLOW}     Se recomienda Node.js 18+ para mejor compatibilidad${NC}"
    fi
else
    echo -e "${RED}   ❌ Node.js no esta instalado${NC}"
    case $OS in
        "Linux")
            echo -e "${RED}     Instalar con: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -${NC}"
            echo -e "${RED}                   sudo apt-get install -y nodejs${NC}"
            ;;
        "macOS")
            echo -e "${RED}     Instalar con: brew install node${NC}"
            ;;
        *)
            echo -e "${RED}     Descarga desde: https://nodejs.org/${NC}"
            ;;
    esac
    exit 1
fi

# Verificar npm
echo -e "${WHITE}   Verificando npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}   ✓ npm encontrado: v$NPM_VERSION${NC}"
else
    echo -e "${RED}   ❌ npm no esta disponible${NC}"
    exit 1
fi

echo ""

# =================== CLONADO DEL REPOSITORIO ===================

if [ "$SKIP_CLONE" = false ]; then
    echo -e "${YELLOW}2. Clonando repositorio...${NC}"
    
    if [ -d "$PROJECT_FOLDER" ]; then
        echo -e "${YELLOW}   ⚠ La carpeta '$PROJECT_FOLDER' ya existe${NC}"
        read -p "   ¿Deseas eliminarla y clonar de nuevo? (s/N): " response
        if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
            rm -rf "$PROJECT_FOLDER"
            echo -e "${YELLOW}   Carpeta eliminada${NC}"
        else
            echo -e "${YELLOW}   Usando carpeta existente...${NC}"
            SKIP_CLONE=true
        fi
    fi
    
    if [ "$SKIP_CLONE" = false ]; then
        echo -e "${WHITE}   Clonando desde: $GIT_URL${NC}"
        if git clone "$GIT_URL" "$PROJECT_FOLDER"; then
            echo -e "${GREEN}   ✓ Repositorio clonado exitosamente${NC}"
        else
            echo -e "${RED}   ❌ Error clonando repositorio${NC}"
            exit 1
        fi
    fi
    
    echo ""
fi

# =================== CAMBIAR AL DIRECTORIO DEL PROYECTO ===================

echo -e "${YELLOW}3. Configurando directorio de trabajo...${NC}"

if [ -d "$PROJECT_FOLDER" ]; then
    cd "$PROJECT_FOLDER"
    echo -e "${GREEN}   ✓ Cambiado al directorio: $PROJECT_FOLDER${NC}"
else
    echo -e "${RED}   ❌ No se encuentra la carpeta del proyecto: $PROJECT_FOLDER${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}   ❌ No se encuentra package.json en el proyecto${NC}"
    exit 1
fi

echo -e "${GREEN}   ✓ Proyecto BurbujApp validado${NC}"
echo ""

# =================== EJECUTAR SETUP SEGÚN SISTEMA OPERATIVO ===================

echo -e "${YELLOW}4. Configurando entorno de desarrollo...${NC}"

case $OS in
    "Windows")
        if [ -f "scripts/setup-dev-environment.ps1" ]; then
            echo -e "${WHITE}   Ejecutando script de PowerShell...${NC}"
            powershell -ExecutionPolicy Bypass -File scripts/setup-dev-environment.ps1
        elif [ -f "scripts/setup-dev-environment.bat" ]; then
            echo -e "${WHITE}   Ejecutando script de Batch...${NC}"
            cmd //c scripts/setup-dev-environment.bat
        else
            echo -e "${YELLOW}   Scripts de Windows no encontrados, ejecutando setup básico...${NC}"
        fi
        ;;
    "Linux"|"macOS")
        if [ -f "scripts/setup-dev-environment.sh" ]; then
            echo -e "${WHITE}   Ejecutando script de shell...${NC}"
            chmod +x scripts/setup-dev-environment.sh
            ./scripts/setup-dev-environment.sh
        else
            echo -e "${YELLOW}   Script de shell no encontrado, ejecutando setup básico...${NC}"
        fi
        ;;
    *)
        echo -e "${YELLOW}   Sistema operativo no reconocido, ejecutando setup básico...${NC}"
        ;;
esac

# Setup básico si no hay scripts específicos
if [ ! -f "scripts/setup-dev-environment.sh" ] && [ ! -f "scripts/setup-dev-environment.ps1" ]; then
    echo -e "${WHITE}   Ejecutando configuración básica...${NC}"
    
    # Limpiar instalaciones previas
    [ -d "node_modules" ] && rm -rf node_modules
    [ -f "package-lock.json" ] && rm -f package-lock.json
    
    # Crear directorios
    mkdir -p logs temp .expo
    
    # Instalar dependencias
    npm install --legacy-peer-deps
    npm install -D json-server --legacy-peer-deps
    
    echo -e "${GREEN}   ✓ Configuración básica completada${NC}"
fi

echo ""

# =================== RESUMEN FINAL ===================

echo -e "${CYAN}================================================================${NC}"
echo -e "${GREEN} INSTALACION COMPLETADA EXITOSAMENTE!${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

echo -e "${GREEN}🎉 BurbujApp esta listo para desarrollo!${NC}"
echo ""
echo -e "${CYAN}UBICACION DEL PROYECTO:${NC}"
echo -e "${WHITE}  $(pwd)${NC}"
echo ""
echo -e "${CYAN}COMANDOS PRINCIPALES:${NC}"
echo -e "${WHITE}  npm run dev          - Iniciar entorno completo${NC}"
echo -e "${WHITE}  npm run dev:fast     - Iniciar con API rapida${NC}"
echo -e "${WHITE}  npm run dev:stop     - Detener servicios${NC}"
echo -e "${WHITE}  npm start            - Solo Expo${NC}"
echo -e "${WHITE}  npm run mock-api     - Solo JSON Server${NC}"
echo ""
echo -e "${CYAN}URLS IMPORTANTES:${NC}"
echo -e "${WHITE}  JSON Server: http://localhost:3001${NC}"
echo -e "${WHITE}  Expo Metro:  http://localhost:8081${NC}"
echo ""
echo -e "${YELLOW}SIGUIENTE PASO:${NC}"
echo -e "${GREEN}  cd $PROJECT_FOLDER${NC}"
echo -e "${GREEN}  npm run dev${NC}"
echo ""
echo -e "${CYAN}================================================================${NC}"
