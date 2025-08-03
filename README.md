# Frontend - React Native App

## Descripción
Aplicación móvil desarrollada en React Native con Expo para gestión empresarial.

## Tecnologías
- React Native
- Expo
- TypeScript
- React Navigation
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
