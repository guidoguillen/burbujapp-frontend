// Setup global para tests - configuraciones que no requieren mocks
import '@testing-library/react-native/extend-expect';

// Configuración global de timeouts
jest.setTimeout(10000);

// Variables de entorno para testing
process.env.NODE_ENV = 'test';

// Mock de console.warn para tests más limpios (opcional)
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Filtrar warnings específicos que no queremos en tests
  const message = args[0];
  if (typeof message === 'string' && message.includes('deprecated')) {
    return;
  }
  originalWarn(...args);
};
