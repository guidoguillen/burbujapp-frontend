import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MisOrdenes'>;

interface Cliente {
  nombre: string;
  apellido: string;
  telefono: string;
}

interface Orden {
  id: string;
  cliente: Cliente;
  fechaCreacion: string;
  articulos: number;
  total: number;
  estado: 'Registrado' | 'En proceso' | 'Terminado';
}

type EstadoFiltro = 'Registrado' | 'En proceso' | 'Terminado';
type OrdenamientoTipo = 'reciente' | 'antiguo' | 'total_asc' | 'total_desc';

export const MisOrdenesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [estadoActivo, setEstadoActivo] = useState<EstadoFiltro>('Registrado');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState<OrdenamientoTipo>('reciente');
  const [mostrarDropdownOrden, setMostrarDropdownOrden] = useState(false);

  // Datos mock de órdenes
  const [ordenes] = useState<Orden[]>([
    {
      id: 'ABC123',
      cliente: { nombre: 'Juan', apellido: 'Pérez', telefono: '77712345' },
      fechaCreacion: '2025-08-04T10:30:00',
      articulos: 5,
      total: 85,
      estado: 'Registrado'
    },
    {
      id: 'DEF456',
      cliente: { nombre: 'María', apellido: 'García', telefono: '68823456' },
      fechaCreacion: '2025-08-04T14:15:00',
      articulos: 3,
      total: 120,
      estado: 'En proceso'
    },
    {
      id: 'GHI789',
      cliente: { nombre: 'Carlos', apellido: 'López', telefono: '79934567' },
      fechaCreacion: '2025-08-03T09:45:00',
      articulos: 8,
      total: 200,
      estado: 'Terminado'
    },
    {
      id: 'JKL012',
      cliente: { nombre: 'Ana', apellido: 'Martínez', telefono: '75645678' },
      fechaCreacion: '2025-08-03T16:20:00',
      articulos: 2,
      total: 45,
      estado: 'Registrado'
    },
    {
      id: 'MNO345',
      cliente: { nombre: 'Pedro', apellido: 'Rodríguez', telefono: '69756789' },
      fechaCreacion: '2025-08-02T11:10:00',
      articulos: 6,
      total: 150,
      estado: 'Terminado'
    },
    {
      id: 'PQR678',
      cliente: { nombre: 'Lucía', apellido: 'Fernández', telefono: '73867890' },
      fechaCreacion: '2025-08-05T08:30:00',
      articulos: 4,
      total: 95,
      estado: 'En proceso'
    },
  ]);

  const normalizarTexto = (texto: string): string => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const filtrarOrdenes = (): Orden[] => {
    let ordenesFiltradas = ordenes.filter(orden => orden.estado === estadoActivo);

    // Aplicar filtro de búsqueda
    if (textoBusqueda.trim()) {
      const busquedaNormalizada = normalizarTexto(textoBusqueda);
      ordenesFiltradas = ordenesFiltradas.filter(orden => {
        const nombreCompleto = `${orden.cliente.nombre} ${orden.cliente.apellido}`;
        return (
          normalizarTexto(nombreCompleto).includes(busquedaNormalizada) ||
          orden.cliente.telefono.includes(textoBusqueda) ||
          normalizarTexto(orden.id).includes(busquedaNormalizada)
        );
      });
    }

    // Aplicar ordenamiento
    ordenesFiltradas.sort((a, b) => {
      switch (ordenamiento) {
        case 'reciente':
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        case 'antiguo':
          return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
        case 'total_asc':
          return a.total - b.total;
        case 'total_desc':
          return b.total - a.total;
        default:
          return 0;
      }
    });

    return ordenesFiltradas;
  };

  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]}, ${fecha.getFullYear()}`;
  };

  const getEstadoColor = (estado: EstadoFiltro) => {
    switch (estado) {
      case 'Registrado':
        return { backgroundColor: '#FEF3C7', color: '#92400E', icon: 'clipboard-text' as const };
      case 'En proceso':
        return { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'cog' as const };
      case 'Terminado':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'check-circle' as const };
    }
  };

  const ordenamientoOpciones = [
    { valor: 'reciente', label: 'Más reciente' },
    { valor: 'antiguo', label: 'Más antiguo' },
    { valor: 'total_desc', label: 'Total mayor' },
    { valor: 'total_asc', label: 'Total menor' },
  ];

  const ordenesFiltradas = filtrarOrdenes();

  const getContadorPorEstado = (estado: EstadoFiltro): number => {
    return ordenes.filter(orden => orden.estado === estado).length;
  };

  const renderOrden = ({ item }: { item: Orden }) => {
    const estadoStyle = getEstadoColor(item.estado);
    
    return (
      <View style={styles.ordenCard}>
        <View style={styles.ordenHeader}>
          <View>
            <Text style={styles.ordenId}>🧾 Orden #{item.id}</Text>
            <Text style={styles.clienteNombre}>
              👤 {item.cliente.nombre} {item.cliente.apellido}
            </Text>
          </View>
          
          <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.backgroundColor }]}>
            <MaterialCommunityIcons 
              name={estadoStyle.icon} 
              size={14} 
              color={estadoStyle.color} 
            />
            <Text style={[styles.estadoText, { color: estadoStyle.color }]}>
              {item.estado}
            </Text>
          </View>
        </View>

        <View style={styles.ordenDetalles}>
          <Text style={styles.ordenDetalle}>
            📆 {formatearFecha(item.fechaCreacion)}
          </Text>
          <Text style={styles.ordenDetalle}>
            📦 Artículos: {item.articulos}
          </Text>
          <Text style={styles.ordenTotal}>
            💵 Total: {item.total} Bs
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.verDetallesBtn}
          onPress={() => navigation.navigate('DetalleOrden', { ordenId: item.id })}
        >
          <MaterialCommunityIcons name="eye" size={16} color="#3B82F6" />
          <Text style={styles.verDetallesBtnText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Órdenes</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Filtros por estado */}
      <View style={styles.filtrosEstado}>
        {(['Registrado', 'En proceso', 'Terminado'] as EstadoFiltro[]).map((estado) => {
          const isActive = estadoActivo === estado;
          const estadoStyle = getEstadoColor(estado);
          const contador = getContadorPorEstado(estado);
          
          return (
            <TouchableOpacity
              key={estado}
              style={[
                styles.filtroTab,
                isActive && { backgroundColor: estadoStyle.backgroundColor }
              ]}
              onPress={() => setEstadoActivo(estado)}
            >
              <MaterialCommunityIcons 
                name={estadoStyle.icon} 
                size={16} 
                color={isActive ? estadoStyle.color : '#6B7280'} 
              />
              <Text style={[
                styles.filtroTabText,
                isActive && { color: estadoStyle.color, fontWeight: '700' }
              ]}>
                {estado} ({contador})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Barra de búsqueda y ordenamiento */}
      <View style={styles.busquedaContainer}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente, teléfono o código..."
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
          />
          {textoBusqueda.length > 0 && (
            <TouchableOpacity onPress={() => setTextoBusqueda('')}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.ordenarBtn}
          onPress={() => setMostrarDropdownOrden(!mostrarDropdownOrden)}
        >
          <MaterialCommunityIcons name="sort" size={20} color="#3B82F6" />
          <MaterialCommunityIcons name="chevron-down" size={16} color="#3B82F6" />
        </TouchableOpacity>

        {/* Dropdown de ordenamiento */}
        {mostrarDropdownOrden && (
          <View style={styles.dropdown}>
            {ordenamientoOpciones.map((opcion) => (
              <TouchableOpacity
                key={opcion.valor}
                style={styles.dropdownItem}
                onPress={() => {
                  setOrdenamiento(opcion.valor as OrdenamientoTipo);
                  setMostrarDropdownOrden(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  ordenamiento === opcion.valor && styles.dropdownItemTextActive
                ]}>
                  {opcion.label}
                </Text>
                {ordenamiento === opcion.valor && (
                  <MaterialCommunityIcons name="check" size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Lista de órdenes */}
      <FlatList
        data={ordenesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderOrden}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-remove" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No hay órdenes {estadoActivo.toLowerCase()}</Text>
            <Text style={styles.emptySubtext}>
              {textoBusqueda ? 'Prueba con otro término de búsqueda' : 'Las órdenes aparecerán aquí'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSpacer: {
    width: 24,
  },
  backBtn: {
    padding: 8,
  },
  filtrosEstado: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtroTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    gap: 6,
  },
  filtroTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  busquedaContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  ordenarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    minWidth: 150,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownItemTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  listaContainer: {
    padding: 16,
  },
  ordenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ordenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ordenId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  clienteNombre: {
    fontSize: 14,
    color: '#6B7280',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ordenDetalles: {
    gap: 4,
    marginBottom: 12,
  },
  ordenDetalle: {
    fontSize: 14,
    color: '#6B7280',
  },
  ordenTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  verDetallesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  verDetallesBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
