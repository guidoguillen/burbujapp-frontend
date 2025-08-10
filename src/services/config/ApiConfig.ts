/**
 * Configuración centralizada de APIs
 * Permite cambiar fácilmente entre mock y producción
 */

import { JSON_SERVER_URL } from './IpConfig';

export interface ApiEnvironment {
  name: string;
  baseUrl: string;
  useMock: boolean;
  timeout: number;
  version: string;
}

// Configuraciones para diferentes entornos
export const API_ENVIRONMENTS: Record<string, ApiEnvironment> = {
  // Desarrollo con JSON Server (recomendado)
  development: {
    name: 'Desarrollo (JSON Server)',
    baseUrl: JSON_SERVER_URL,
    useMock: false, // JSON Server es una API real
    timeout: 5000,
    version: ''
  },
  
  // Desarrollo con mocks internos (alternativo)
  mock: {
    name: 'Desarrollo (Mock Interno)',
    baseUrl: 'http://localhost:3000/api',
    useMock: true,
    timeout: 2000,
    version: 'v1'
  },
  
  // Staging con .NET Core (cuando esté listo)
  staging: {
    name: 'Staging (.NET Core)',
    baseUrl: 'https://burbujapp-staging.koyeb.app/api',
    useMock: false,
    timeout: 10000,
    version: 'v1'
  },
  
  // Producción con .NET Core
  production: {
    name: 'Producción (.NET Core)',
    baseUrl: 'https://burbujapp.koyeb.app/api',
    useMock: false,
    timeout: 10000,
    version: 'v1'
  }
};

// Configuración actual (cambiar según necesidad)
export const CURRENT_ENVIRONMENT: keyof typeof API_ENVIRONMENTS = 'development';

// Configuración activa
export const API_CONFIG = API_ENVIRONMENTS[CURRENT_ENVIRONMENT];

// Headers comunes
export const getApiHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': '1.0.0',
    'X-Platform': 'mobile'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// URLs de endpoints
export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  },
  
  // Clientes
  clientes: {
    list: '/clientes',
    create: '/clientes',
    getById: (id: string) => `/clientes/${id}`,
    update: (id: string) => `/clientes/${id}`,
    delete: (id: string) => `/clientes/${id}`
  },
  
  // Servicios
  servicios: {
    list: '/servicios',
    create: '/servicios',
    getById: (id: string) => `/servicios/${id}`,
    update: (id: string) => `/servicios/${id}`,
    delete: (id: string) => `/servicios/${id}`
  },
  
  // Órdenes
  ordenes: {
    list: '/ordenes',
    create: '/ordenes',
    getById: (id: string) => `/ordenes/${id}`,
    update: (id: string) => `/ordenes/${id}`,
    updateEstado: (id: string) => `/ordenes/${id}/estado`,
    updatePago: (id: string) => `/ordenes/${id}/pago`,
    delete: (id: string) => `/ordenes/${id}`
  },
  
  // Reportes
  reportes: {
    dashboard: '/reportes/dashboard',
    ventas: '/reportes/ventas',
    clientes: '/reportes/clientes'
  },
  
  // Notificaciones
  notificaciones: {
    send: '/notificaciones/send',
    whatsapp: '/notificaciones/whatsapp'
  }
};

// Configuración de mock delays (para simular latencia real)
export const MOCK_DELAYS = {
  fast: 300,    // Operaciones rápidas (get by id)
  normal: 800,  // Operaciones normales (list, create)
  slow: 1500,   // Operaciones lentas (reports, bulk operations)
  error: 2000   // Simular errores de timeout
};

// Configuración de errores simulados
export const MOCK_ERROR_RATES = {
  network: 0.05,    // 5% de errores de red
  server: 0.02,     // 2% de errores del servidor
  validation: 0.08  // 8% de errores de validación
};

export default API_CONFIG;
