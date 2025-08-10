# 🧼 BurbujApp Frontend

**BurbujApp** es una aplicación móvil integral para la gestión de lavanderías bolivianas, desarrollada con React Native y Expo. Incluye un completo sistema de mock API con JSON Server para desarrollo y testing.

## 🚀 Instalación Rápida

### Una sola línea (Recomendado):

**Windows PowerShell:**
```powershell
irm https://raw.githubusercontent.com/guidoguillen/burbujapp-frontend/master/install-burbujapp.sh | iex
```

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/guidoguillen/burbujapp-frontend/master/install-burbujapp.sh | bash
```

### O manualmente:
```bash
git clone https://github.com/guidoguillen/burbujapp-frontend.git
cd burbujapp-frontend
npm run setup
npm run dev
```

## 🎯 Scripts de Desarrollo

### 🚀 Inicio Completo
```bash
npm run dev              # Inicia JSON Server + Expo
npm run dev:fast         # Sin delay en API
npm run dev:android      # Solo Android, sin navegador
npm run dev:stop         # Detener todos los servicios
```

### 🗃️ Solo Mock API
```bash
npm run mock-api         # JSON Server con delay realista
npm run mock-api-fast    # JSON Server sin delay
```

### 📱 Solo React Native
```bash
npm start                # Expo Dev Server
npm run android          # Solo Android
npm run ios              # Solo iOS (macOS)
```

### ⚙️ Configuración
```bash
npm run setup            # Configurar entorno
npm run setup:extensions # + extensiones VS Code
npm run clone-setup      # Clonar y configurar desde cero
```

## 🌐 URLs del Entorno

- **📱 App (Expo):** http://localhost:8081
- **🗃️ Mock API:** http://localhost:3001
- **👥 Clientes:** http://localhost:3001/clientes
- **🛠️ Servicios:** http://localhost:3001/servicios
- **📋 Órdenes:** http://localhost:3001/ordenes
- **📊 Dashboard:** http://localhost:3001/dashboard

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Button, Input, etc.
│   ├── forms/           # Formularios específicos
│   ├── layout/          # Header, Navigation
│   └── ui/              # Componentes de interfaz
├── screens/             # Pantallas principales
│   ├── auth/           # Login, Registro
│   ├── dashboard/      # Panel principal
│   ├── clients/        # Gestión clientes
│   ├── services/       # Gestión servicios
│   ├── orders/         # Gestión órdenes
│   ├── inventory/      # Control inventario
│   ├── payments/       # Sistema de pagos
│   ├── promotions/     # Promociones
│   ├── reports/        # Reportes
│   └── scheduling/     # Programación
├── navigation/          # Configuración navegación
├── context/            # Contextos React
├── services/           # API y configuración
│   ├── api.ts          # Cliente API principal
│   └── config/         # Configuración IP y entorno
├── types/              # Definiciones TypeScript
├── constants/          # Constantes y temas
├── utils/              # Utilidades
└── styles/             # Estilos globales

scripts/                 # Scripts de desarrollo
├── setup-dev-environment.* # Configuración automática
├── start-dev.*         # Inicio de desarrollo
├── stop-dev.*          # Detener servicios
└── clone-and-setup.*   # Instalación completa

db.json                  # Base de datos mock
logs/                    # Logs de desarrollo
```

## 🗃️ Mock API - Datos Incluidos

### 👥 Clientes (15 registros)
```json
{
  "id": 1,
  "nombre": "María González",
  "telefono": "70123456",
  "email": "maria@email.com",
  "direccion": "Av. América #123, La Paz"
}
```

### 🛠️ Servicios (8 tipos)
```json
{
  "id": 1,
  "nombre": "Lavado Básico",
  "precio": 15.00,
  "tiempo_estimado": "2 horas",
  "descripcion": "Lavado estándar para ropa diaria"
}
```

### 📋 Órdenes (20 registros)
```json
{
  "id": 1,
  "cliente_id": 1,
  "servicio_id": 1,
  "estado": "en_proceso",
  "fecha_ingreso": "2024-01-15T10:30:00Z",
  "total": 45.50
}
```

### 📊 Dashboard
- Resumen de ventas diarias/mensuales
- Estadísticas de órdenes activas
- Métricas de clientes
- Indicadores de rendimiento

## 🔧 Tecnologías

### Frontend
- **React Native** con Expo
- **TypeScript** para tipado fuerte
- **React Navigation** para navegación
- **React Context** para estado global
- **Expo Router** para ruteo avanzado

### Mock Backend
- **JSON Server** para API REST simulada
- **Datos realistas** bolivianos
- **CORS habilitado** para desarrollo
- **Delay configurable** para simular latencia

### Desarrollo
- **PowerShell/Bash** scripts multiplataforma
- **Detección automática de IP** para red local
- **Hot Reload** en desarrollo
- **Logging detallado** en carpeta `logs/`

## 📋 Funcionalidades

### ✅ Completadas
- 🔐 **Autenticación:** Login y logout
- 👥 **Gestión de Clientes:** CRUD completo
- 🛠️ **Servicios:** Catálogo y precios
- 📋 **Órdenes:** Crear, ver, actualizar estado
- 📊 **Dashboard:** Métricas y estadísticas
- 🎨 **UI/UX:** Componentes reutilizables
- 🔧 **Mock API:** Sistema completo de desarrollo

### 🚧 En Desarrollo
- 💰 **Sistema de Pagos**
- 📦 **Control de Inventario**
- 🎯 **Promociones y Descuentos**
- 📈 **Reportes Avanzados**
- ⏰ **Programación de Servicios**
- 🔔 **Notificaciones Push**

## 📚 Documentación Adicional

- **[📖 Guía de Instalación Completa](INSTALLATION_GUIDE.md)**
- **[⚡ Inicio Rápido](DEV_QUICK_START.md)**
- **[🗃️ Documentación JSON Server](JSON_SERVER_README.md)**

## 🔍 Comandos de Diagnóstico

```bash
# Verificar estado del entorno
node --version              # Node.js instalado
npm --version               # npm disponible
npx expo --version          # Expo CLI funcionando

# Verificar servicios activos
curl http://localhost:3001/clientes  # API respondiendo
curl http://localhost:8081          # Expo activo

# Ver logs en tiempo real
tail -f logs/json-server.log        # API logs
tail -f logs/expo.log               # Expo logs
```

## 🆘 Solución de Problemas

### API no responde:
```bash
npm run dev:stop && npm run dev
```

### Dependencias con errores:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Puerto ocupado:
```bash
npm run dev:stop-force
```

### Cambio de red:
```bash
# Actualizar: src/services/config/IpConfig.ts
npm run dev:stop && npm run dev
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

---

**💡 Para empezar rápidamente:** Ejecuta `npm run dev` después de la instalación y tendrás toda la aplicación funcionando con datos de prueba.
```bash
# Iniciar el proyecto
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

### Compilación y Validación
```bash
# Verificar tipos TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Ejecutar pruebas
npm test

# Build para producción
npm run build
```

## Configuración Inicial

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd burbujapp-frontend
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Configurar Expo**
```bash
npx expo install
```

4. **Iniciar el proyecto**
```bash
npm start
```

## Estado del Proyecto

✅ **Completado:**
- Estructura base del proyecto
- Configuración de TypeScript
- Configuración de ESLint
- Configuración de navegación
- Componentes básicos (Button, Input, Header)
- Pantallas base (Login, Dashboard)
- Contexto de autenticación
- Servicios de API base
- Configuración de git y .gitignore

🚧 **En desarrollo:**
- Implementación completa de módulos específicos
- Pruebas unitarias
- Integración con APIs backend
- Estilos y diseño UI/UX

## Notas Importantes

- El proyecto usa `--legacy-peer-deps` para resolver conflictos de dependencias entre React 18.3.1 y las librerías de testing
- La configuración de ESLint está simplificada para evitar conflictos de versiones
- Se recomienda usar Expo CLI para el desarrollo

## Contribución

Revisar el archivo `CONTRIBUTING.md` para las guías de contribución al proyecto.
- Context API

## Estructura del Proyecto
```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes comunes
│   ├── forms/           # Formularios
│   ├── layout/          # Layouts y estructuras
│   └── ui/              # Elementos UI básicos
├── screens/             # Pantallas de la aplicación
├── navigation/          # Configuración de navegación
├── hooks/               # Custom hooks
├── context/             # Context providers
├── services/            # Servicios y APIs
├── store/               # Estado global
├── types/               # Tipos TypeScript
├── constants/           # Constantes globales
├── styles/              # Estilos globales
└── utils/               # Funciones utilitarias
```

## Instalación
```bash
npm install
```

## Desarrollo
```bash
npm start          # Iniciar servidor de desarrollo
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm run web        # Ejecutar en web
```

## Scripts Disponibles
- `start`: Inicia el servidor de desarrollo de Expo
- `android`: Ejecuta la app en Android
- `ios`: Ejecuta la app en iOS
- `web`: Ejecuta la app en navegador web

## Estructura de Pantallas
- **auth/**: Autenticación y login
- **dashboard/**: Panel principal
- **clients/**: Gestión de clientes
- **inventory/**: Gestión de inventario
- **orders/**: Gestión de pedidos
- **payments/**: Gestión de pagos
- **promotions/**: Gestión de promociones
- **reports/**: Reportes y analytics
- **scheduling/**: Programación y calendarios
- **services/**: Gestión de servicios
