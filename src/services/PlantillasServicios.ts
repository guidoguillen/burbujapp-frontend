export interface ServicioTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'lavado' | 'planchado' | 'limpieza_seco' | 'especiales';
  icon: string;
  precio_base: number;
  unidad: 'kilo' | 'unidad' | 'metro';
  tiempo_estimado: number; // en horas
  instrucciones?: string;
  popular: boolean;
}

export const PLANTILLAS_SERVICIOS: ServicioTemplate[] = [
  // LAVADO
  {
    id: 'lav_001',
    nombre: 'Lavado básico',
    descripcion: 'Lavado estándar para ropa cotidiana',
    categoria: 'lavado',
    icon: 'washing-machine',
    precio_base: 8.0,
    unidad: 'kilo',
    tiempo_estimado: 2,
    instrucciones: 'Separar colores claros y oscuros',
    popular: true,
  },
  {
    id: 'lav_002',
    nombre: 'Lavado delicado',
    descripcion: 'Para prendas delicadas y sedas',
    categoria: 'lavado',
    icon: 'tshirt-crew',
    precio_base: 12.0,
    unidad: 'kilo',
    tiempo_estimado: 3,
    instrucciones: 'Usar agua fría y detergente especial',
    popular: false,
  },
  {
    id: 'lav_003',
    nombre: 'Lavado deportivo',
    descripcion: 'Para ropa deportiva y de ejercicio',
    categoria: 'lavado',
    icon: 'run',
    precio_base: 10.0,
    unidad: 'kilo',
    tiempo_estimado: 2.5,
    instrucciones: 'Eliminar olores y manchas de sudor',
    popular: true,
  },

  // PLANCHADO
  {
    id: 'pla_001',
    nombre: 'Planchado básico',
    descripcion: 'Planchado estándar para camisas y pantalones',
    categoria: 'planchado',
    icon: 'iron',
    precio_base: 15.0,
    unidad: 'unidad',
    tiempo_estimado: 0.5,
    popular: true,
  },
  {
    id: 'pla_002',
    nombre: 'Planchado premium',
    descripcion: 'Planchado de alta calidad con almidón',
    categoria: 'planchado',
    icon: 'iron-outline',
    precio_base: 20.0,
    unidad: 'unidad',
    tiempo_estimado: 0.75,
    instrucciones: 'Incluye almidón y acabado profesional',
    popular: false,
  },
  {
    id: 'pla_003',
    nombre: 'Planchado express',
    descripcion: 'Planchado rápido para emergencias',
    categoria: 'planchado',
    icon: 'clock-fast',
    precio_base: 25.0,
    unidad: 'unidad',
    tiempo_estimado: 0.25,
    instrucciones: 'Listo en menos de 2 horas',
    popular: true,
  },

  // LIMPIEZA EN SECO
  {
    id: 'sec_001',
    nombre: 'Limpieza en seco básica',
    descripcion: 'Para trajes y vestidos formales',
    categoria: 'limpieza_seco',
    icon: 'tuxedo',
    precio_base: 35.0,
    unidad: 'unidad',
    tiempo_estimado: 24,
    instrucciones: 'Revisar etiquetas de cuidado',
    popular: true,
  },
  {
    id: 'sec_002',
    nombre: 'Limpieza de abrigos',
    descripcion: 'Especializado en abrigos y chaquetas',
    categoria: 'limpieza_seco',
    icon: 'coat-hanger',
    precio_base: 45.0,
    unidad: 'unidad',
    tiempo_estimado: 48,
    popular: false,
  },

  // ESPECIALES
  {
    id: 'esp_001',
    nombre: 'Lavado de edredones',
    descripcion: 'Lavado especial para edredones y colchas',
    categoria: 'especiales',
    icon: 'bed',
    precio_base: 30.0,
    unidad: 'unidad',
    tiempo_estimado: 4,
    instrucciones: 'Secado con temperatura controlada',
    popular: true,
  },
  {
    id: 'esp_002',
    nombre: 'Lavado de cortinas',
    descripcion: 'Lavado y planchado de cortinas',
    categoria: 'especiales',
    icon: 'window-shutter',
    precio_base: 25.0,
    unidad: 'metro',
    tiempo_estimado: 6,
    popular: false,
  },
  {
    id: 'esp_003',
    nombre: 'Lavado de alfombras',
    descripcion: 'Limpieza profunda de alfombras',
    categoria: 'especiales',
    icon: 'rug',
    precio_base: 20.0,
    unidad: 'metro',
    tiempo_estimado: 8,
    instrucciones: 'Secado natural requerido',
    popular: false,
  },
  {
    id: 'esp_004',
    nombre: 'Lavado de zapatos',
    descripcion: 'Limpieza y cuidado de calzado',
    categoria: 'especiales',
    icon: 'shoe-formal',
    precio_base: 15.0,
    unidad: 'unidad',
    tiempo_estimado: 12,
    popular: true,
  },
];

export const CATEGORIAS_SERVICIOS = [
  {
    id: 'lavado',
    nombre: 'Lavado',
    icon: 'washing-machine',
    color: '#3B82F6',
  },
  {
    id: 'planchado',
    nombre: 'Planchado',
    icon: 'iron',
    color: '#F59E0B',
  },
  {
    id: 'limpieza_seco',
    nombre: 'Limpieza en Seco',
    icon: 'tuxedo',
    color: '#8B5CF6',
  },
  {
    id: 'especiales',
    nombre: 'Servicios Especiales',
    icon: 'star',
    color: '#059669',
  },
];

// Funciones de utilidad
export const obtenerServiciosPorCategoria = (categoria: string): ServicioTemplate[] => {
  return PLANTILLAS_SERVICIOS.filter(servicio => servicio.categoria === categoria);
};

export const obtenerServiciosPopulares = (): ServicioTemplate[] => {
  return PLANTILLAS_SERVICIOS.filter(servicio => servicio.popular);
};

export const buscarServicios = (query: string): ServicioTemplate[] => {
  const queryLower = query.toLowerCase();
  return PLANTILLAS_SERVICIOS.filter(servicio => 
    servicio.nombre.toLowerCase().includes(queryLower) ||
    servicio.descripcion.toLowerCase().includes(queryLower)
  );
};

export const calcularPrecioEstimado = (
  servicioId: string, 
  cantidad: number,
  factorUrgencia: number = 1
): number => {
  const servicio = PLANTILLAS_SERVICIOS.find(s => s.id === servicioId);
  if (!servicio) return 0;
  
  return servicio.precio_base * cantidad * factorUrgencia;
};

export const calcularTiempoEstimado = (servicios: { id: string; cantidad: number }[]): number => {
  return servicios.reduce((total, item) => {
    const servicio = PLANTILLAS_SERVICIOS.find(s => s.id === item.id);
    return total + (servicio ? servicio.tiempo_estimado * item.cantidad : 0);
  }, 0);
};
