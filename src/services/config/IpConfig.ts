/**
 * Configuración de IP Local
 * Cambiar aquí la IP cuando cambies de red
 */

// IP de la máquina donde corre JSON Server
export const LOCAL_IP = '192.168.0.23';

// Puerto donde corre JSON Server
export const JSON_SERVER_PORT = '3001';

// URL completa para JSON Server
export const JSON_SERVER_URL = `http://${LOCAL_IP}:${JSON_SERVER_PORT}`;

// Función para verificar si estamos usando JSON Server
export const isJsonServerUrl = (url: string): boolean => {
  return url.includes(':3001') || url.includes('localhost:3001');
};
