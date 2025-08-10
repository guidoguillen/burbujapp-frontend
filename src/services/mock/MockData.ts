/**
 * Datos de prueba realistas para simular el microservicio
 * Estos datos serán reemplazados por los datos reales del .NET Core backend
 */

import { Cliente, Servicio, Orden, EstadoOrden, MetodoPago } from '../types/ApiTypes';

// =================== CLIENTES MOCK ===================
export const CLIENTES_MOCK: Cliente[] = [
  {
    id: 'cliente-001',
    nombre: 'Gabriel',
    apellido: 'Molina',
    email: 'gabriel.molina@email.com',
    telefono: '+591 79954303',
    direccion: 'Av. Banzer 3er anillo, zona norte',
    telefonoSecundario: '+591 78123456',
    estado: 'Activo',
    fechaCreacion: '2024-01-15T10:30:00Z',
    totalOrdenes: 15,
    ultimaOrden: '2024-08-05T14:20:00Z'
  },
  {
    id: 'cliente-002',
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@email.com',
    telefono: '+591 78567890',
    direccion: 'Calle Libertad #234, zona centro',
    estado: 'Activo',
    fechaCreacion: '2024-02-20T09:15:00Z',
    totalOrdenes: 8,
    ultimaOrden: '2024-08-01T11:45:00Z'
  },
  {
    id: 'cliente-003',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '+591 77234567',
    direccion: 'Av. Cristo Redentor #567, zona sur',
    telefonoSecundario: '+591 76987654',
    estado: 'Activo',
    fechaCreacion: '2024-03-10T16:22:00Z',
    totalOrdenes: 12,
    ultimaOrden: '2024-07-28T13:30:00Z'
  },
  {
    id: 'cliente-004',
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@email.com',
    telefono: '+591 79876543',
    direccion: 'Barrio Las Palmas, calle 7 #123',
    estado: 'Activo',
    fechaCreacion: '2024-04-05T08:45:00Z',
    totalOrdenes: 6,
    ultimaOrden: '2024-07-25T15:10:00Z'
  },
  {
    id: 'cliente-005',
    nombre: 'Roberto',
    apellido: 'Silva',
    email: 'roberto.silva@email.com',
    telefono: '+591 78345678',
    direccion: 'Zona El Bajío, manzana 15 #45',
    estado: 'Inactivo',
    fechaCreacion: '2024-01-30T12:00:00Z',
    totalOrdenes: 3,
    ultimaOrden: '2024-05-15T10:20:00Z'
  }
];

// =================== SERVICIOS MOCK ===================
export const SERVICIOS_MOCK: Servicio[] = [
  // LAVADO
  {
    id: 'servicio-001',
    nombre: 'Lavado Ropa Casual',
    descripcion: 'Lavado completo de ropa casual (camisas, pantalones, ropa interior)',
    categoria: 'lavado',
    precio: 8.50,
    unidad: 'kilo',
    tiempoEstimado: 24,
    instrucciones: 'Separar colores claros y oscuros. Revisar bolsillos.',
    popular: true,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },
  {
    id: 'servicio-002',
    nombre: 'Lavado Ropa Delicada',
    descripcion: 'Lavado especial para ropa delicada (seda, encajes, prendas finas)',
    categoria: 'lavado',
    precio: 15.00,
    unidad: 'kilo',
    tiempoEstimado: 48,
    instrucciones: 'Lavado a mano con productos especiales para telas delicadas.',
    popular: false,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },
  {
    id: 'servicio-003',
    nombre: 'Lavado Ropa Deportiva',
    descripcion: 'Lavado especializado para ropa deportiva y de ejercicio',
    categoria: 'lavado',
    precio: 10.00,
    unidad: 'kilo',
    tiempoEstimado: 24,
    instrucciones: 'Eliminar olores y manchas de sudor. Usar desinfectante.',
    popular: true,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },

  // PLANCHADO
  {
    id: 'servicio-004',
    nombre: 'Planchado Básico',
    descripcion: 'Planchado estándar de camisas, pantalones y ropa casual',
    categoria: 'planchado',
    precio: 3.50,
    unidad: 'unidad',
    tiempoEstimado: 12,
    instrucciones: 'Planchado profesional con almidón suave.',
    popular: true,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },
  {
    id: 'servicio-005',
    nombre: 'Planchado Premium',
    descripcion: 'Planchado de alta calidad para ropa formal y ejecutiva',
    categoria: 'planchado',
    precio: 6.00,
    unidad: 'unidad',
    tiempoEstimado: 24,
    instrucciones: 'Planchado perfecto con almidón profesional y colgado especial.',
    popular: false,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },

  // LIMPIEZA EN SECO
  {
    id: 'servicio-006',
    nombre: 'Limpieza en Seco Trajes',
    descripcion: 'Limpieza profesional en seco para trajes y ropa formal',
    categoria: 'limpieza_seco',
    precio: 25.00,
    unidad: 'unidad',
    tiempoEstimado: 72,
    instrucciones: 'Limpieza con solventes especiales. Incluye planchado profesional.',
    popular: true,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },
  {
    id: 'servicio-007',
    nombre: 'Limpieza en Seco Vestidos',
    descripcion: 'Limpieza especializada para vestidos de fiesta y ropa formal femenina',
    categoria: 'limpieza_seco',
    precio: 30.00,
    unidad: 'unidad',
    tiempoEstimado: 72,
    instrucciones: 'Cuidado especial para telas delicadas y adornos.',
    popular: false,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },

  // ESPECIALES
  {
    id: 'servicio-008',
    nombre: 'Lavado de Edredones',
    descripcion: 'Lavado especializado para edredones, cobijas y ropa de cama',
    categoria: 'especiales',
    precio: 20.00,
    unidad: 'unidad',
    tiempoEstimado: 48,
    instrucciones: 'Lavado industrial con secado completo y desinfección.',
    popular: true,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },
  {
    id: 'servicio-009',
    nombre: 'Lavado de Zapatos',
    descripcion: 'Limpieza y lavado profesional de calzado deportivo y casual',
    categoria: 'especiales',
    precio: 15.00,
    unidad: 'unidad',
    tiempoEstimado: 24,
    instrucciones: 'Limpieza profunda con productos especializados para calzado.',
    popular: false,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  },
  {
    id: 'servicio-010',
    nombre: 'Lavado de Cortinas',
    descripcion: 'Lavado profesional de cortinas y decoración textil del hogar',
    categoria: 'especiales',
    precio: 12.00,
    unidad: 'metro',
    tiempoEstimado: 48,
    instrucciones: 'Medición previa. Lavado según tipo de tela.',
    popular: false,
    activo: true,
    fechaCreacion: '2024-01-01T00:00:00Z'
  }
];

// =================== ÓRDENES MOCK ===================
export const ORDENES_MOCK: Orden[] = [
  {
    id: 'orden-001',
    numeroOrden: 'ORD-20240809-0001',
    clienteId: 'cliente-001',
    cliente: {
      id: 'cliente-001',
      nombre: 'Gabriel',
      apellido: 'Molina',
      telefono: '+591 79954303',
      email: 'gabriel.molina@email.com',
      direccion: 'Av. Banzer 3er anillo, zona norte'
    },
    articulos: [
      {
        id: 'articulo-001',
        servicioId: 'servicio-001',
        servicio: {
          nombre: 'Lavado Ropa Casual',
          unidad: 'kilo'
        },
        cantidad: 3,
        precioUnitario: 8.50,
        subtotal: 25.50,
        instrucciones: 'Separar camisas blancas'
      },
      {
        id: 'articulo-002',
        servicioId: 'servicio-004',
        servicio: {
          nombre: 'Planchado Básico',
          unidad: 'unidad'
        },
        cantidad: 5,
        precioUnitario: 3.50,
        subtotal: 17.50,
        instrucciones: 'Planchado con almidón suave'
      }
    ],
    subtotal: 43.00,
    descuento: 3.00,
    recargo: 0,
    total: 40.00,
    estado: 'En proceso',
    fechaCreacion: '2024-08-09T10:30:00Z',
    fechaEstimada: '2024-08-11T18:00:00Z',
    fechaEntrega: null,
    observaciones: 'Cliente prefiere entrega en la tarde',
    metodoPago: 'efectivo',
    urgente: false,
    pagado: false,
    historialEstados: [
      {
        id: 'estado-001',
        ordenId: 'orden-001',
        estadoAnterior: null,
        estadoNuevo: 'Registrado',
        fechaCambio: '2024-08-09T10:30:00Z',
        usuarioId: 'user-001',
        usuario: 'Gabriel Molina',
        observaciones: 'Orden creada'
      },
      {
        id: 'estado-002',
        ordenId: 'orden-001',
        estadoAnterior: 'Registrado',
        estadoNuevo: 'En proceso',
        fechaCambio: '2024-08-09T14:15:00Z',
        usuarioId: 'user-001',
        usuario: 'Operador Sistema',
        observaciones: 'Ropa en lavado'
      }
    ],
    usuarioCreacion: 'Gabriel Molina'
  },
  {
    id: 'orden-002',
    numeroOrden: 'ORD-20240808-0015',
    clienteId: 'cliente-002',
    cliente: {
      id: 'cliente-002',
      nombre: 'María',
      apellido: 'González',
      telefono: '+591 78567890',
      email: 'maria.gonzalez@email.com',
      direccion: 'Calle Libertad #234, zona centro'
    },
    articulos: [
      {
        id: 'articulo-003',
        servicioId: 'servicio-006',
        servicio: {
          nombre: 'Limpieza en Seco Trajes',
          unidad: 'unidad'
        },
        cantidad: 2,
        precioUnitario: 25.00,
        subtotal: 50.00,
        instrucciones: 'Cuidado especial con las solapas'
      }
    ],
    subtotal: 50.00,
    descuento: 0,
    recargo: 5.00,
    total: 55.00,
    estado: 'Listo',
    fechaCreacion: '2024-08-08T09:20:00Z',
    fechaEstimada: '2024-08-11T16:00:00Z',
    fechaEntrega: null,
    observaciones: 'Servicio express solicitado',
    metodoPago: 'tarjeta',
    urgente: true,
    pagado: true,
    historialEstados: [
      {
        id: 'estado-003',
        ordenId: 'orden-002',
        estadoAnterior: null,
        estadoNuevo: 'Registrado',
        fechaCambio: '2024-08-08T09:20:00Z',
        usuarioId: 'user-002',
        usuario: 'María González',
        observaciones: 'Orden creada con urgencia'
      },
      {
        id: 'estado-004',
        ordenId: 'orden-002',
        estadoAnterior: 'Registrado',
        estadoNuevo: 'En proceso',
        fechaCambio: '2024-08-08T11:30:00Z',
        usuarioId: 'user-001',
        usuario: 'Operador Sistema',
        observaciones: 'Enviado a limpieza en seco'
      },
      {
        id: 'estado-005',
        ordenId: 'orden-002',
        estadoAnterior: 'En proceso',
        estadoNuevo: 'Listo',
        fechaCambio: '2024-08-09T15:45:00Z',
        usuarioId: 'user-001',
        usuario: 'Operador Sistema',
        observaciones: 'Limpieza completada, listo para entrega'
      }
    ],
    usuarioCreacion: 'María González'
  }
];

// =================== FUNCIONES HELPER ===================

/**
 * Generar más clientes mock dinámicamente
 */
export const generateMoreClientes = (count: number): Cliente[] => {
  const nombres = ['Luis', 'Carmen', 'Pedro', 'Rosa', 'Miguel', 'Elena', 'Juan', 'Sofia', 'Diego', 'Patricia'];
  const apellidos = ['Vargas', 'Chávez', 'Morales', 'Herrera', 'Ramos', 'Flores', 'Castro', 'Jiménez', 'Mendoza', 'Sánchez'];
  const zonas = ['zona norte', 'zona sur', 'zona centro', 'zona este', 'zona oeste'];
  
  return Array.from({ length: count }, (_, index) => {
    const nombre = nombres[index % nombres.length];
    const apellido = apellidos[index % apellidos.length];
    const id = `cliente-${String(index + 100).padStart(3, '0')}`;
    
    return {
      id,
      nombre,
      apellido,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@email.com`,
      telefono: `+591 7${Math.floor(Math.random() * 9000000) + 1000000}`,
      direccion: `Calle ${Math.floor(Math.random() * 500) + 1}, ${zonas[index % zonas.length]}`,
      estado: Math.random() > 0.1 ? 'Activo' : 'Inactivo',
      fechaCreacion: new Date(2024, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1).toISOString(),
      totalOrdenes: Math.floor(Math.random() * 20),
      ultimaOrden: Math.random() > 0.3 ? new Date(2024, 7, Math.floor(Math.random() * 9) + 1).toISOString() : undefined
    };
  });
};

/**
 * Generar más órdenes mock dinámicamente
 */
export const generateMoreOrdenes = (count: number): Orden[] => {
  const estados: EstadoOrden[] = ['Registrado', 'En proceso', 'Listo', 'Entregado', 'Cancelado'];
  const metodosPago: MetodoPago[] = ['efectivo', 'tarjeta', 'transferencia', 'qr'];
  
  return Array.from({ length: count }, (_, index) => {
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const cliente = CLIENTES_MOCK[Math.floor(Math.random() * CLIENTES_MOCK.length)];
    const servicio = SERVICIOS_MOCK[Math.floor(Math.random() * SERVICIOS_MOCK.length)];
    const cantidad = Math.floor(Math.random() * 5) + 1;
    const subtotal = cantidad * servicio.precio;
    const descuento = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0;
    const recargo = Math.random() > 0.8 ? 5 : 0;
    const total = subtotal - descuento + recargo;
    
    return {
      id: `orden-${String(index + 100).padStart(3, '0')}`,
      numeroOrden: `ORD-20240${Math.floor(Math.random() * 2) + 7}${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}-${String(index + 100).padStart(4, '0')}`,
      clienteId: cliente.id,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion
      },
      articulos: [{
        id: `articulo-${String(index + 100).padStart(3, '0')}`,
        servicioId: servicio.id,
        servicio: {
          nombre: servicio.nombre,
          unidad: servicio.unidad
        },
        cantidad,
        precioUnitario: servicio.precio,
        subtotal,
        instrucciones: Math.random() > 0.5 ? 'Sin instrucciones especiales' : undefined
      }],
      subtotal,
      descuento,
      recargo,
      total,
      estado,
      fechaCreacion: new Date(2024, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1).toISOString(),
      fechaEstimada: new Date(2024, 8, Math.floor(Math.random() * 15) + 10).toISOString(),
      fechaEntrega: estado === 'Entregado' ? new Date(2024, 8, Math.floor(Math.random() * 9) + 1).toISOString() : null,
      observaciones: Math.random() > 0.6 ? 'Observaciones del cliente' : undefined,
      metodoPago: metodosPago[Math.floor(Math.random() * metodosPago.length)],
      urgente: Math.random() > 0.8,
      pagado: estado === 'Entregado' || Math.random() > 0.4,
      historialEstados: [{
        id: `estado-${String(index + 100).padStart(3, '0')}`,
        ordenId: `orden-${String(index + 100).padStart(3, '0')}`,
        estadoAnterior: null,
        estadoNuevo: 'Registrado',
        fechaCambio: new Date(2024, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1).toISOString(),
        usuarioId: 'user-001',
        usuario: 'Sistema',
        observaciones: 'Orden creada'
      }],
      usuarioCreacion: `${cliente.nombre} ${cliente.apellido}`
    };
  });
};

// Datos completos para la simulación
export const ALL_CLIENTES = [...CLIENTES_MOCK, ...generateMoreClientes(50)];
export const ALL_ORDENES = [...ORDENES_MOCK, ...generateMoreOrdenes(100)];
export const ALL_SERVICIOS = SERVICIOS_MOCK;
