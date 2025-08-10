import { JSON_SERVER_URL } from '../services/config/IpConfig';

// URLs de la API - Usando JSON Server para desarrollo
export const API_URLS = {
  BASE_URL: JSON_SERVER_URL,
  AUTH: '/auth',
  USERS: '/users',
  CLIENTS: '/clientes',
  PRODUCTS: '/productos',
  ORDERS: '/ordenes',
  SERVICES: '/servicios',
  PAYMENTS: '/payments',
  REPORTS: '/reports',
  DASHBOARD: '/dashboard',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'Mi App Empresarial',
  VERSION: '1.0.0',
  BUILD: 1,
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Configuración de formularios
export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  PHONE_PATTERN: /^[+]?[\d\s\-\(\)]+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Guardado exitosamente',
  DELETE_SUCCESS: 'Eliminado exitosamente',
  UPDATE_SUCCESS: 'Actualizado exitosamente',
  LOGIN_SUCCESS: 'Bienvenido de vuelta',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
};

// Configuración de fechas
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.sssZ',
};

// Configuración de moneda
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  LOCALE: 'es-ES',
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

// Estados de productos
export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
} as const;

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Métodos de pago
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
  DIGITAL_WALLET: 'digital_wallet',
} as const;

// Configuración de AsyncStorage keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@app:user_token',
  USER_DATA: '@app:user_data',
  SETTINGS: '@app:settings',
  THEME: '@app:theme',
} as const;
