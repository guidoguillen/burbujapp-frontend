// Ejemplo de integración con Mock API
// Archivo: src/services/BurbujAppApiService.example.ts

import axios, { AxiosInstance } from 'axios';

/**
 * Configuración del API basada en el ambiente
 * 
 * En desarrollo: usa json-server en localhost
 * En producción: usa API real
 */

// ═════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═════════════════════════════════════════════════════════════════

const MOCK_PORT = process.env.MOCK_API_PORT || 3001;

const API_BASE_URL = __DEV__
  ? `http://localhost:${MOCK_PORT}`  // Mock API en desarrollo
  : 'https://api.produccion.com';     // API real en producción

console.log(`🔗 API URL: ${API_BASE_URL}`);

// ═════════════════════════════════════════════════════════════════
// CLIENTE HTTP
// ═════════════════════════════════════════════════════════════════

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging
apiClient.interceptors.request.use((config) => {
  console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ Error:`, error.message);
    return Promise.reject(error);
  }
);

// ═════════════════════════════════════════════════════════════════
// TIPOS
// ═════════════════════════════════════════════════════════════════

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  telefonoSecundario?: string;
  estado: 'Activo' | 'Inactivo';
  fechaCreacion: string;
  totalOrdenes: number;
  ultimaOrden?: string;
}

interface Orden {
  id: string;
  clienteId: string;
  descripcion: string;
  total: number;
  estado: 'Pendiente' | 'En Proceso' | 'Completada' | 'Cancelada';
  fecha: string;
  detalles?: string;
}

// ═════════════════════════════════════════════════════════════════
// CLIENTES
// ═════════════════════════════════════════════════════════════════

export const clientesApi = {
  /**
   * Obtener lista de todos los clientes
   */
  async getAll() {
    const { data } = await apiClient.get<Cliente[]>('/clientes');
    return data;
  },

  /**
   * Obtener cliente por ID
   */
  async getById(id: string) {
    const { data } = await apiClient.get<Cliente>(`/clientes/${id}`);
    return data;
  },

  /**
   * Crear nuevo cliente
   */
  async create(cliente: Omit<Cliente, 'id'>) {
    const { data } = await apiClient.post<Cliente>('/clientes', {
      id: `cliente-${Date.now()}`,
      ...cliente,
      fechaCreacion: new Date().toISOString(),
      totalOrdenes: 0,
    });
    return data;
  },

  /**
   * Actualizar cliente existente
   */
  async update(id: string, updates: Partial<Cliente>) {
    const { data } = await apiClient.put<Cliente>(`/clientes/${id}`, updates);
    return data;
  },

  /**
   * Eliminar cliente
   */
  async delete(id: string) {
    await apiClient.delete(`/clientes/${id}`);
  },

  /**
   * Buscar clientes por nombre
   */
  async search(query: string) {
    const { data } = await apiClient.get<Cliente[]>('/clientes', {
      params: { q: query },
    });
    return data;
  },
};

// ═════════════════════════════════════════════════════════════════
// ÓRDENES
// ═════════════════════════════════════════════════════════════════

export const ordenesApi = {
  /**
   * Obtener lista de órdenes
   */
  async getAll() {
    const { data } = await apiClient.get<Orden[]>('/ordenes');
    return data;
  },

  /**
   * Obtener orden por ID
   */
  async getById(id: string) {
    const { data } = await apiClient.get<Orden>(`/ordenes/${id}`);
    return data;
  },

  /**
   * Crear nueva orden
   */
  async create(orden: Omit<Orden, 'id'>) {
    const { data } = await apiClient.post<Orden>('/ordenes', {
      id: `orden-${Date.now()}`,
      ...orden,
    });
    return data;
  },

  /**
   * Actualizar orden
   */
  async update(id: string, updates: Partial<Orden>) {
    const { data } = await apiClient.put<Orden>(`/ordenes/${id}`, updates);
    return data;
  },

  /**
   * Eliminar orden
   */
  async delete(id: string) {
    await apiClient.delete(`/ordenes/${id}`);
  },

  /**
   * Obtener órdenes de un cliente
   */
  async getByCliente(clienteId: string) {
    const { data } = await apiClient.get<Orden[]>('/ordenes', {
      params: { clienteId },
    });
    return data;
  },
};

// ═════════════════════════════════════════════════════════════════
// EJEMPLOS DE USO EN COMPONENTES
// ═════════════════════════════════════════════════════════════════

/**
 * EJEMPLO 1: Listar clientes en un componente
 */
export async function usarClientesExample() {
  try {
    // Obtener todos
    const clientes = await clientesApi.getAll();
    console.log('Clientes:', clientes);

    // Crear uno nuevo
    const nuevoCliente = await clientesApi.create({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@email.com',
      telefono: '+591 79123456',
      direccion: 'Calle Principal 123',
      estado: 'Activo',
    });
    console.log('Creado:', nuevoCliente);

    // Actualizar
    await clientesApi.update(nuevoCliente.id, {
      estado: 'Inactivo',
    });

    // Buscar
    const resultados = await clientesApi.search('Juan');
    console.log('Resultados búsqueda:', resultados);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * EJEMPLO 2: Listar órdenes de un cliente
 */
export async function usarOrdenesExample() {
  try {
    // Obtener órdenes del cliente
    const ordenes = await ordenesApi.getByCliente('cliente-001');
    console.log('Órdenes:', ordenes);

    // Crear nueva orden
    const nuevaOrden = await ordenesApi.create({
      clienteId: 'cliente-001',
      descripcion: 'Impresión de tarjetas',
      total: 5000,
      estado: 'Pendiente',
      fecha: new Date().toISOString(),
    });
    console.log('Orden creada:', nuevaOrden);

    // Cambiar estado
    await ordenesApi.update(nuevaOrden.id, {
      estado: 'Completada',
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// ═════════════════════════════════════════════════════════════════
// EJEMPLO 3: En un React Hook
// ═════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoading(true);
        const data = await clientesApi.getAll();
        setClientes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

  return { clientes, loading, error };
}

// USO EN COMPONENTE:
// function ListaClientesScreen() {
//   const { clientes, loading, error } = useClientes();
//
//   if (loading) return <Text>Cargando...</Text>;
//   if (error) return <Text>Error: {error}</Text>;
//
//   return (
//     <ScrollView>
//       {clientes.map(cliente => (
//         <Text key={cliente.id}>{cliente.nombre}</Text>
//       ))}
//     </ScrollView>
//   );
// }

// ═════════════════════════════════════════════════════════════════
// EJEMPLO 4: En un componente con formulario
// ═════════════════════════════════════════════════════════════════

export async function crearClienteDesdeFormulario(formData: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}) {
  try {
    const clienteCreado = await clientesApi.create({
      ...formData,
      estado: 'Activo',
    });
    console.log('✅ Cliente creado:', clienteCreado);
    return clienteCreado;
  } catch (error) {
    console.error('❌ Error al crear cliente:', error);
    throw error;
  }
}

// ═════════════════════════════════════════════════════════════════
// NOTAS IMPORTANTES
// ═════════════════════════════════════════════════════════════════

/**
 * ⚠️ IMPORTANTE:
 *
 * 1. La URL del API se configura automáticamente desde:
 *    - Variable de entorno: MOCK_API_PORT (configurada por setup-full-dev.ps1)
 *    - Por defecto: localhost:3001
 *
 * 2. En desarrollo (Expo):
 *    - El localhost de la app apunta a la máquina host
 *    - Esto funciona en Android y iOS
 *
 * 3. Cambiar datos:
 *    - Edita db.json
 *    - Los cambios se aplican automáticamente en json-server
 *    - Recarga la app en Expo (presiona 'r')
 *
 * 4. Agregar nuevos recursos:
 *    - Agrega nueva sección en db.json
 *    - Crea API similares a clientesApi y ordenesApi
 *    - Úsalos en componentes con los mismos patrones
 */
