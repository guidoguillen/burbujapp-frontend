# 🧪 Plan de Implementación de Unit Tests - BurbujApp

## 📋 Resumen Ejecutivo

**Factibilidad:** ✅ **MUY FACTIBLE**  
**Tiempo estimado:** 2-3 semanas  
**Cobertura objetivo:** 80%+  
**ROI:** Alto - detectar bugs temprano, refactoring seguro, documentación viva

---

## 🎯 Evaluación Actual

### ✅ **Fortalezas del Proyecto para Testing:**
1. **Arquitectura limpia** - Servicios, componentes y utils separados
2. **TypeScript completo** - Tipos bien definidos
3. **Jest ya configurado** - Base sólida existente
4. **Mock API implementada** - Facilita testing de integración
5. **Funciones puras** - Muchas utilities son fáciles de testear
6. **Componentes modulares** - Props bien definidas

### ❌ **Gaps Identificados:**
1. **Dependencias faltantes** - @testing-library/react-native
2. **Sin estructura de tests** - Carpetas __tests__ no existen
3. **Sin tests existentes** - Comenzar desde cero
4. **Mocking setup** - Configurar mocks para Expo/React Native

---

## 📦 Dependencias Necesarias

### **Instalar Ahora:**
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native react-test-renderer
npm install --save-dev @testing-library/user-event jest-environment-jsdom
```

### **Opcional (Avanzado):**
```bash
npm install --save-dev @testing-library/react-hooks
npm install --save-dev jest-expo  # Si se necesita testing específico de Expo
```

---

## 🏗️ Estructura de Testing Propuesta

```
src/
├── __tests__/                          # Tests globales
│   ├── setup.ts                        # Setup global para tests
│   └── mocks/                          # Mocks globales
│       ├── expo-mocks.ts               # Mocks de Expo
│       ├── navigation-mocks.ts         # Mocks de navegación
│       └── api-mocks.ts                # Mocks de APIs
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx             # ✅ Test del componente
│   │   ├── Input.tsx
│   │   └── Input.test.tsx              # ✅ Test del componente
│   └── forms/
│       ├── TestAsistenciayCajaComponent.tsx
│       └── TestAsistenciayCajaComponent.test.tsx  # ✅ Test del componente
├── services/
│   ├── BusquedaAvanzadaService.ts
│   ├── BusquedaAvanzadaService.test.ts # ✅ Test del servicio
│   ├── mock/
│   │   ├── MockApiService.ts
│   │   └── MockApiService.test.ts      # ✅ Test del mock
│   └── __tests__/                      # Tests de servicios
│       ├── api-integration.test.ts     # Tests de integración
│       └── error-handling.test.ts      # Tests de manejo de errores
├── utils/
│   ├── testJsonServer.ts
│   ├── testJsonServer.test.ts          # ✅ Test de utilities
│   └── __tests__/                      # Tests de utilities
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts                 # ✅ Test de hooks
└── screens/
    ├── auth/
    │   ├── LoginScreen.tsx
    │   └── LoginScreen.test.tsx        # ✅ Test de pantallas
    └── dashboard/
        ├── DashboardScreen.tsx
        └── DashboardScreen.test.tsx    # ✅ Test de pantallas
```

---

## 🎯 Priorización de Tests (Fases)

### **Fase 1: Foundation (Semana 1)**
1. **✅ Setup inicial y configuración**
   - Instalar dependencias
   - Configurar mocks globales
   - Setup de testing utilities

2. **✅ Servicios Core (Alta prioridad)**
   - `BusquedaAvanzadaService.test.ts` 
   - `MockApiService.test.ts`
   - Tests de API responses

3. **✅ Utilities (Alta prioridad)**
   - `testJsonServer.test.ts`
   - Helpers y formatters

### **Fase 2: Components (Semana 2)**
1. **✅ Componentes Common**
   - `Button.test.tsx`
   - `Input.test.tsx`
   - `Header.test.tsx`

2. **✅ Componentes Forms**
   - `TestCrearClienteComponent.test.tsx`
   - `TestCrearOrdenComponent.test.tsx`
   - `TestAsistenciayCajaComponent.test.tsx`

### **Fase 3: Screens & Integration (Semana 3)**
1. **✅ Screens principales**
   - `LoginScreen.test.tsx`
   - `DashboardScreen.test.tsx`
   - `MisOrdenesScreen.test.tsx`

2. **✅ Tests de integración**
   - Flujos completos de usuario
   - Tests end-to-end simplificados

---

## 📋 Ejemplos de Tests a Implementar

### **1. Service Test Example:**
```typescript
// src/services/BusquedaAvanzadaService.test.ts
describe('BusquedaAvanzadaService', () => {
  test('debe obtener usuarios exitosamente', async () => {
    const service = BusquedaAvanzadaService.getInstance();
    const result = await service.obtenerUsuariosAPI();
    
    expect(result.success).toBe(true);
    expect(result.usuarios).toBeDefined();
    expect(Array.isArray(result.usuarios)).toBe(true);
  });

  test('debe manejar errores de red correctamente', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));
    
    const service = BusquedaAvanzadaService.getInstance();
    const result = await service.obtenerUsuariosAPI();
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error');
  });
});
```

### **2. Component Test Example:**
```typescript
// src/components/common/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  test('debe renderizar correctamente', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('debe ejecutar onPress cuando se presiona', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

### **3. API Integration Test:**
```typescript
// src/services/__tests__/api-integration.test.ts
describe('API Integration Tests', () => {
  beforeEach(() => {
    // Setup JSON Server mock
  });

  test('debe crear y obtener cliente exitosamente', async () => {
    const service = BusquedaAvanzadaService.getInstance();
    
    // Crear cliente
    const nuevoCliente = {
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      telefono: '+591 12345678'
    };
    
    const createResult = await service.crearClienteAPI(nuevoCliente);
    expect(createResult.success).toBe(true);
    
    // Verificar que se puede obtener
    const getResult = await service.buscarClientesAPI({ texto: 'Test' });
    expect(getResult.success).toBe(true);
    expect(getResult.items.length).toBeGreaterThan(0);
  });
});
```

---

## 🔧 Configuración Necesaria

### **1. Actualizar jest.config.js:**
```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/src/__tests__/setup.ts'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### **2. Actualizar jest.setup.js:**
```javascript
import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Ionicons: 'Ionicons',
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Global test timeout
jest.setTimeout(10000);
```

---

## 📊 Métricas y Coverage

### **Objetivos de Cobertura:**
- **Servicios:** 90%+ (críticos para la aplicación)
- **Componentes:** 80%+ (UI components)
- **Utilities:** 95%+ (funciones puras)
- **Hooks:** 85%+ (lógica de estado)
- **Screens:** 60%+ (principalmente smoke tests)

### **Scripts de Testing:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false",
    "test:update-snapshots": "jest --updateSnapshot"
  }
}
```

---

## 🎉 Beneficios Esperados

### **Inmediatos:**
1. **🐛 Detección temprana de bugs**
2. **🔄 Refactoring seguro** 
3. **📝 Documentación viva** del código
4. **⚡ Desarrollo más rápido** (menos debugging manual)

### **Largo Plazo:**
1. **🚀 Deployment con confianza**
2. **👥 Onboarding más fácil** para nuevos desarrolladores
3. **🏗️ Arquitectura más robusta**
4. **📈 Mejor mantenibilidad**

---

## 🚦 Plan de Acción Inmediata

### **Paso 1: Instalar dependencias (5 min)**
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native react-test-renderer
```

### **Paso 2: Configurar setup básico (30 min)**
- Actualizar jest.config.js
- Crear mocks básicos
- Setup de testing utilities

### **Paso 3: Primer test (1 hora)**
- Implementar test simple de BusquedaAvanzadaService
- Verificar que todo funcione

### **Paso 4: Escalar gradualmente**
- 1-2 tests por día
- Enfoque en código crítico primero
- Incrementar cobertura paulatinamente

---

## ✅ Conclusión

**La implementación de unit tests para BurbujApp es MUY FACTIBLE y ALTAMENTE RECOMENDADA.**

**Factores favorables:**
- ✅ Arquitectura bien estructurada
- ✅ TypeScript completo
- ✅ Jest ya configurado
- ✅ Servicios bien separados
- ✅ Mock API existente

**Inversión requerida:** Moderada (2-3 semanas)  
**ROI esperado:** Alto (mejor calidad, menos bugs, desarrollo más rápido)

¿Quieres que proceda con la implementación del setup inicial?
