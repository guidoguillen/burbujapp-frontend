# BurbujaApp Frontend

## Descripción
Aplicación móvil desarrollada en React Native con Expo para gestión empresarial completa. Incluye módulos para manejo de clientes, inventario, pedidos, pagos, promociones, reportes, programación de citas y servicios.

## Tecnologías
- React Native GG
- Expo ~53.0.20
- TypeScript ~5.8.3
- React Navigation v6
- React 18.3.1

## Estructura del Proyecto
```
src/
├── components/        # Componentes reutilizables
│   ├── common/       # Componentes básicos (Button, Input, etc.)
│   ├── forms/        # Componentes de formularios
│   ├── layout/       # Componentes de layout (Header, etc.)
│   └── ui/           # Componentes de interfaz
├── constants/        # Constantes y configuraciones
├── context/          # Contextos de React
├── hooks/            # Custom hooks
├── navigation/       # Configuración de navegación
├── screens/          # Pantallas de la aplicación
│   ├── auth/         # Autenticación
│   ├── clients/      # Gestión de clientes
│   ├── dashboard/    # Dashboard principal
│   ├── inventory/    # Gestión de inventario
│   ├── orders/       # Gestión de pedidos
│   ├── payments/     # Gestión de pagos
│   ├── promotions/   # Gestión de promociones
│   ├── reports/      # Reportes y estadísticas
│   ├── scheduling/   # Programación de citas
│   └── services/     # Gestión de servicios
├── services/         # Servicios y API calls
├── store/            # Gestión de estado global
├── styles/           # Estilos globales
├── types/            # Definiciones de tipos TypeScript
└── utils/            # Utilidades y helpers
```

## Scripts Disponibles

### Instalación
```bash
npm install --legacy-peer-deps
```

### Desarrollo
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
