export interface FiltrosBusqueda {
  texto: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: string[];
  cliente?: string;
  servicio?: string[];
  precioMin?: number;
  precioMax?: number;
  ordenarPor: 'fecha' | 'precio' | 'cliente' | 'estado';
  direccionOrden: 'asc' | 'desc';
  tipoServicio?: string[];
}

export interface ResultadoBusqueda<T> {
  items: T[];
  total: number;
  filtrosAplicados: number;
  coincidenciasTexto: number;
}

export class BusquedaAvanzadaService {
  private static instance: BusquedaAvanzadaService;

  static getInstance(): BusquedaAvanzadaService {
    if (!BusquedaAvanzadaService.instance) {
      BusquedaAvanzadaService.instance = new BusquedaAvanzadaService();
    }
    return BusquedaAvanzadaService.instance;
  }

  // Búsqueda de órdenes con filtros avanzados
  buscarOrdenes(ordenes: any[], filtros: FiltrosBusqueda): ResultadoBusqueda<any> {
    let resultados = [...ordenes];
    let filtrosAplicados = 0;
    let coincidenciasTexto = 0;

    // Filtro por texto (busca en múltiples campos)
    if (filtros.texto.trim()) {
      const textoBusqueda = filtros.texto.toLowerCase();
      resultados = resultados.filter(orden => {
        const campos = [
          orden.id?.toString() || '',
          orden.cliente?.nombre || '',
          orden.cliente?.telefono || '',
          orden.servicios?.map((s: any) => s.tipo).join(' ') || '',
          orden.notas || '',
          orden.observaciones || '',
        ];
        
        const coincide = campos.some(campo => 
          campo.toLowerCase().includes(textoBusqueda)
        );
        
        if (coincide) coincidenciasTexto++;
        return coincide;
      });
      filtrosAplicados++;
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio || filtros.fechaFin) {
      resultados = resultados.filter(orden => {
        const fechaOrden = new Date(orden.fecha_creacion);
        let cumple = true;

        if (filtros.fechaInicio) {
          cumple = cumple && fechaOrden >= filtros.fechaInicio;
        }

        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
          cumple = cumple && fechaOrden <= fechaFin;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Filtro por estado
    if (filtros.estado && filtros.estado.length > 0) {
      resultados = resultados.filter(orden => 
        filtros.estado!.includes(orden.estado)
      );
      filtrosAplicados++;
    }

    // Filtro por cliente
    if (filtros.cliente) {
      const clienteBusqueda = filtros.cliente.toLowerCase();
      resultados = resultados.filter(orden => 
        orden.cliente?.nombre?.toLowerCase().includes(clienteBusqueda) ||
        orden.cliente?.telefono?.includes(clienteBusqueda)
      );
      filtrosAplicados++;
    }

    // Filtro por tipo de servicio
    if (filtros.servicio && filtros.servicio.length > 0) {
      resultados = resultados.filter(orden => 
        orden.servicios?.some((s: any) => 
          filtros.servicio!.includes(s.tipo)
        )
      );
      filtrosAplicados++;
    }

    // Filtro por rango de precio
    if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
      resultados = resultados.filter(orden => {
        const precio = parseFloat(orden.total || 0);
        let cumple = true;

        if (filtros.precioMin !== undefined) {
          cumple = cumple && precio >= filtros.precioMin;
        }

        if (filtros.precioMax !== undefined) {
          cumple = cumple && precio <= filtros.precioMax;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Ordenamiento
    resultados = this.ordenarResultados(resultados, filtros.ordenarPor, filtros.direccionOrden);

    return {
      items: resultados,
      total: resultados.length,
      filtrosAplicados,
      coincidenciasTexto,
    };
  }

  // Búsqueda de clientes
  buscarClientes(clientes: any[], filtros: Partial<FiltrosBusqueda>): ResultadoBusqueda<any> {
    let resultados = [...clientes];
    let filtrosAplicados = 0;
    let coincidenciasTexto = 0;

    // Filtro por texto
    if (filtros.texto?.trim()) {
      const textoBusqueda = filtros.texto.toLowerCase();
      resultados = resultados.filter(cliente => {
        const campos = [
          cliente.nombre || '',
          cliente.telefono || '',
          cliente.email || '',
          cliente.direccion || '',
        ];
        
        const coincide = campos.some(campo => 
          campo.toLowerCase().includes(textoBusqueda)
        );
        
        if (coincide) coincidenciasTexto++;
        return coincide;
      });
      filtrosAplicados++;
    }

    // Filtro por fecha de registro
    if (filtros.fechaInicio || filtros.fechaFin) {
      resultados = resultados.filter(cliente => {
        const fechaRegistro = new Date(cliente.fecha_registro);
        let cumple = true;

        if (filtros.fechaInicio) {
          cumple = cumple && fechaRegistro >= filtros.fechaInicio;
        }

        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999);
          cumple = cumple && fechaRegistro <= fechaFin;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Ordenamiento
    if (filtros.ordenarPor && filtros.direccionOrden) {
      resultados = this.ordenarResultados(resultados, filtros.ordenarPor, filtros.direccionOrden);
    }

    return {
      items: resultados,
      total: resultados.length,
      filtrosAplicados,
      coincidenciasTexto,
    };
  }

  // Búsqueda de turnos
  buscarTurnos(turnos: any[], filtros: Partial<FiltrosBusqueda>): ResultadoBusqueda<any> {
    let resultados = [...turnos];
    let filtrosAplicados = 0;
    let coincidenciasTexto = 0;

    // Filtro por texto
    if (filtros.texto?.trim()) {
      const textoBusqueda = filtros.texto.toLowerCase();
      resultados = resultados.filter(turno => {
        const campos = [
          turno.cliente?.nombre || '',
          turno.cliente?.telefono || '',
          turno.servicio || '',
          turno.notas || '',
        ];
        
        const coincide = campos.some(campo => 
          campo.toLowerCase().includes(textoBusqueda)
        );
        
        if (coincide) coincidenciasTexto++;
        return coincide;
      });
      filtrosAplicados++;
    }

    // Filtro por fecha
    if (filtros.fechaInicio || filtros.fechaFin) {
      resultados = resultados.filter(turno => {
        const fechaTurno = new Date(turno.fecha);
        let cumple = true;

        if (filtros.fechaInicio) {
          cumple = cumple && fechaTurno >= filtros.fechaInicio;
        }

        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999);
          cumple = cumple && fechaTurno <= fechaFin;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Filtro por estado
    if (filtros.estado && filtros.estado.length > 0) {
      resultados = resultados.filter(turno => 
        filtros.estado!.includes(turno.estado)
      );
      filtrosAplicados++;
    }

    // Ordenamiento
    if (filtros.ordenarPor && filtros.direccionOrden) {
      resultados = this.ordenarResultados(resultados, filtros.ordenarPor, filtros.direccionOrden);
    }

    return {
      items: resultados,
      total: resultados.length,
      filtrosAplicados,
      coincidenciasTexto,
    };
  }

  // Búsqueda global (en todos los tipos de datos)
  busquedaGlobal(datos: { ordenes: any[]; clientes: any[]; turnos: any[]; }, texto: string) {
    const resultados = {
      ordenes: this.buscarOrdenes(datos.ordenes, {
        texto,
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      }),
      clientes: this.buscarClientes(datos.clientes, {
        texto,
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      }),
      turnos: this.buscarTurnos(datos.turnos, {
        texto,
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      }),
    };

    return {
      ...resultados,
      totalResultados: resultados.ordenes.total + resultados.clientes.total + resultados.turnos.total,
    };
  }

  // Sugerencias de búsqueda basadas en historial
  obtenerSugerencias(datos: { ordenes: any[]; clientes: any[]; }, limite: number = 10): string[] {
    const sugerencias = new Set<string>();

    // Extraer nombres de clientes únicos
    datos.clientes.forEach(cliente => {
      if (cliente.nombre) {
        sugerencias.add(cliente.nombre);
      }
    });

    // Extraer tipos de servicios únicos
    datos.ordenes.forEach(orden => {
      orden.servicios?.forEach((servicio: any) => {
        if (servicio.tipo) {
          sugerencias.add(servicio.tipo);
        }
      });
    });

    // Extraer términos de notas frecuentes
    const notasTexto = datos.ordenes
      .map(orden => orden.notas || '')
      .join(' ')
      .toLowerCase();

    const palabras = notasTexto
      .split(/\s+/)
      .filter(palabra => palabra.length > 3)
      .reduce((contador, palabra) => {
        contador[palabra] = (contador[palabra] || 0) + 1;
        return contador;
      }, {} as Record<string, number>);

    // Agregar palabras más frecuentes
    Object.entries(palabras)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([palabra]) => sugerencias.add(palabra));

    return Array.from(sugerencias).slice(0, limite);
  }

  // Filtros predefinidos comunes
  obtenerFiltrosPredefinidos(): Array<{ nombre: string; filtros: Partial<FiltrosBusqueda> }> {
    const hoy = new Date();
    const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

    return [
      {
        nombre: 'Órdenes pendientes',
        filtros: {
          estado: ['pendiente', 'en_proceso'],
          ordenarPor: 'fecha',
          direccionOrden: 'asc',
        },
      },
      {
        nombre: 'Completadas hoy',
        filtros: {
          estado: ['completada'],
          fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
          fechaFin: hoy,
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Última semana',
        filtros: {
          fechaInicio: hace7Dias,
          fechaFin: hoy,
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Último mes',
        filtros: {
          fechaInicio: hace30Dias,
          fechaFin: hoy,
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Órdenes canceladas',
        filtros: {
          estado: ['cancelada'],
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Precios altos (>$100)',
        filtros: {
          precioMin: 100,
          ordenarPor: 'precio',
          direccionOrden: 'desc',
        },
      },
    ];
  }

  // Método privado para ordenamiento
  private ordenarResultados(items: any[], campo: string, direccion: 'asc' | 'desc'): any[] {
    return items.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (campo) {
        case 'fecha':
          valorA = new Date(a.fecha_creacion || a.fecha_registro || a.fecha);
          valorB = new Date(b.fecha_creacion || b.fecha_registro || b.fecha);
          break;
        case 'precio':
          valorA = parseFloat(a.total || 0);
          valorB = parseFloat(b.total || 0);
          break;
        case 'cliente':
          valorA = a.cliente?.nombre || '';
          valorB = b.cliente?.nombre || '';
          break;
        case 'estado':
          valorA = a.estado || '';
          valorB = b.estado || '';
          break;
        default:
          valorA = a[campo] || '';
          valorB = b[campo] || '';
      }

      if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

export default BusquedaAvanzadaService.getInstance();
