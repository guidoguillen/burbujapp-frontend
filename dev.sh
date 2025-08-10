#!/bin/bash

# BURBUJAPP - Script Universal de Desarrollo
# Detecta automáticamente el sistema y ejecuta el script apropiado

echo ""
echo "================================================================"
echo " 🚀 BURBUJAPP - Iniciando Entorno de Desarrollo"
echo "================================================================"
echo ""

# Detectar sistema operativo
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    echo "🖥️  Sistema detectado: Windows"
    echo "📝 Ejecutando script de PowerShell..."
    
    if command -v powershell &> /dev/null; then
        powershell -ExecutionPolicy Bypass -File scripts/start-dev.ps1
    elif [ -f "scripts/start-dev.bat" ]; then
        echo "⚠️  PowerShell no disponible, usando Batch..."
        ./scripts/start-dev.bat
    else
        echo "❌ No se encontraron scripts de Windows"
        exit 1
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🍎 Sistema detectado: macOS"
    echo "📝 Ejecutando comandos nativos..."
    
    # Verificar dependencias
    if ! command -v json-server &> /dev/null; then
        echo "⚠️  json-server no encontrado, instalando..."
        npm install -D json-server
    fi
    
    # Iniciar servicios
    echo "🗃️  Iniciando JSON Server..."
    npm run mock-api &
    JSON_SERVER_PID=$!
    
    sleep 3
    
    echo "📱 Iniciando Expo..."
    npx expo start --android &
    EXPO_PID=$!
    
    echo ""
    echo "✅ Servicios iniciados:"
    echo "   🗃️  JSON Server: http://localhost:3001"
    echo "   📱 Expo Dev Server: Se abrirá automáticamente"
    echo ""
    echo "🛑 Presiona Ctrl+C para detener todos los servicios"
    
    # Cleanup function
    cleanup() {
        echo ""
        echo "🛑 Deteniendo servicios..."
        kill $JSON_SERVER_PID 2>/dev/null
        kill $EXPO_PID 2>/dev/null
        echo "✅ Servicios detenidos"
        exit 0
    }
    
    trap cleanup SIGINT
    wait
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🐧 Sistema detectado: Linux"
    echo "📝 Ejecutando comandos nativos..."
    
    # Similar a macOS pero con ajustes para Linux
    if ! command -v json-server &> /dev/null; then
        echo "⚠️  json-server no encontrado, instalando..."
        npm install -D json-server
    fi
    
    echo "🗃️  Iniciando JSON Server..."
    npm run mock-api &
    JSON_SERVER_PID=$!
    
    sleep 3
    
    echo "📱 Iniciando Expo..."
    npx expo start --android &
    EXPO_PID=$!
    
    echo ""
    echo "✅ Servicios iniciados:"
    echo "   🗃️  JSON Server: http://localhost:3001"
    echo "   📱 Expo Dev Server: Se abrirá automáticamente"
    echo ""
    echo "🛑 Presiona Ctrl+C para detener todos los servicios"
    
    cleanup() {
        echo ""
        echo "🛑 Deteniendo servicios..."
        kill $JSON_SERVER_PID 2>/dev/null
        kill $EXPO_PID 2>/dev/null
        echo "✅ Servicios detenidos"
        exit 0
    }
    
    trap cleanup SIGINT
    wait
    
else
    echo "❌ Sistema operativo no soportado: $OSTYPE"
    echo "💡 Usa manualmente:"
    echo "   npm run mock-api"
    echo "   npm start"
    exit 1
fi
