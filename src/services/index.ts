/**
 * Exportaciones principales de servicios
 * Punto de entrada único para todos los servicios de la aplicación
 */

// Servicio principal de API (unificado mock/real)
export { 
  default as apiService,
  setAuthToken,
  clearAuthToken,
  getEnvironmentInfo,
  checkServiceHealth
} from './BurbujAppApiService';

// Configuración de API
export { 
  API_CONFIG, 
  API_ENVIRONMENTS, 
  API_ENDPOINTS,
  CURRENT_ENVIRONMENT 
} from './config/ApiConfig';

// Tipos TypeScript
export * from './types/ApiTypes';

// Servicios específicos existentes
export * from './api';
export * from './BackupService';
export * from './NotificationService';
export * from './PlantillasServicios';
export * from './BusquedaAvanzadaService';

// Mock service (para testing y desarrollo)
export { mockApiService } from './mock/MockApiService';

// Servicio legacy (mantener compatibilidad)
export { OrderApiService } from './OrderApiService';
