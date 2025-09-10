import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'HistorialTurnos'>;

interface TurnoCompleto {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
  estado: 'Pendiente' | 'En curso' | 'Finalizado' | 'Cancelado';
  entrada?: string;
  salida?: string;
  cajaInicial?: number;
  cajaFinal?: number;
  totalVentas?: number;
  observaciones?: string;
}

interface ReporteDiario {
  fecha: string;
  totalIngresos: number;
  totalServicios: number;
  serviciosPorTipo: {
    lavado: { cantidad: number; ingresos: number };
    soloLavado: { cantidad: number; ingresos: number };
    planchado: { cantidad: number; ingresos: number };
  };
  clientesAtendidos: number;
  operador: string;
}

export const HistorialTurnosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [vistaActual, setVistaActual] = useState<'turnos' | 'reportes'>('turnos');
  
  // Datos mock del historial completo
  const [turnos] = useState<TurnoCompleto[]>([
    {
      id: '1',
      fecha: '2025-08-05',
      inicio: '08:00',
      fin: '16:00',
      estado: 'En curso',
      entrada: '08:03',
      cajaInicial: 150,
    },
    {
      id: '2',
      fecha: '2025-08-02',
      inicio: '08:00',
      fin: '16:00',
      estado: 'Finalizado',
      entrada: '08:01',
      salida: '16:05',
      cajaInicial: 120,
      cajaFinal: 440,
      totalVentas: 320,
      observaciones: 'Día normal de trabajo'
    },
    {
      id: '3',
      fecha: '2025-08-01',
      inicio: '08:00',
      fin: '16:00',
      estado: 'Finalizado',
      entrada: '08:02',
      salida: '16:00',
      cajaInicial: 100,
      cajaFinal: 390,
      totalVentas: 290,
    },
    {
      id: '4',
      fecha: '2025-07-31',
      inicio: '08:00',
      fin: '16:00',
      estado: 'Finalizado',
      entrada: '08:05',
      salida: '16:02',
      cajaInicial: 150,
      cajaFinal: 520,
      totalVentas: 370,
    },
    {
      id: '5',
      fecha: '2025-07-30',
      inicio: '08:00',
      fin: '16:00',
      estado: 'Cancelado',
      observaciones: 'Día libre por enfermedad'
    },
    {
      id: '6',
      fecha: '2025-07-29',
      inicio: '08:00',
      fin: '16:00',
      estado: 'Finalizado',
      entrada: '08:00',
      salida: '16:10',
      cajaInicial: 80,
      cajaFinal: 350,
      totalVentas: 270,
    },
  ]);

  // Datos mock de reportes diarios con ingresos por servicios
  const [reportesDiarios] = useState<ReporteDiario[]>([
    {
      fecha: '2025-08-02',
      totalIngresos: 320,
      totalServicios: 24,
      serviciosPorTipo: {
        lavado: { cantidad: 10, ingresos: 150 },
        soloLavado: { cantidad: 8, ingresos: 80 },
        planchado: { cantidad: 6, ingresos: 90 }
      },
      clientesAtendidos: 16,
      operador: 'María González'
    },
    {
      fecha: '2025-08-01',
      totalIngresos: 290,
      totalServicios: 20,
      serviciosPorTipo: {
        lavado: { cantidad: 8, ingresos: 120 },
        soloLavado: { cantidad: 7, ingresos: 70 },
        planchado: { cantidad: 5, ingresos: 100 }
      },
      clientesAtendidos: 14,
      operador: 'Carlos López'
    },
    {
      fecha: '2025-07-31',
      totalIngresos: 370,
      totalServicios: 28,
      serviciosPorTipo: {
        lavado: { cantidad: 12, ingresos: 180 },
        soloLavado: { cantidad: 10, ingresos: 100 },
        planchado: { cantidad: 6, ingresos: 90 }
      },
      clientesAtendidos: 19,
      operador: 'Ana Martínez'
    },
    {
      fecha: '2025-07-29',
      totalIngresos: 270,
      totalServicios: 18,
      serviciosPorTipo: {
        lavado: { cantidad: 7, ingresos: 105 },
        soloLavado: { cantidad: 6, ingresos: 60 },
        planchado: { cantidad: 5, ingresos: 105 }
      },
      clientesAtendidos: 12,
      operador: 'Luis Rodríguez'
    }
  ]);

  const filtrosEstado = ['Todos', 'Finalizado', 'En curso', 'Pendiente', 'Cancelado'];

  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return `${dias[date.getDay()]} ${date.getDate()} ${meses[date.getMonth()]}`;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return { backgroundColor: '#FEF3C7', color: '#92400E', icon: 'clock-outline' as const };
      case 'En curso':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'clock-time-four' as const };
      case 'Finalizado':
        return { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'check-circle' as const };
      case 'Cancelado':
        return { backgroundColor: '#FEE2E2', color: '#DC2626', icon: 'close-circle' as const };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', icon: 'clock-outline' as const };
    }
  };

  const turnosFiltrados = turnos.filter(turno => {
    const cumpleFiltroTexto = filtroTexto === '' || 
      formatearFecha(turno.fecha).toLowerCase().includes(filtroTexto.toLowerCase()) ||
      turno.observaciones?.toLowerCase().includes(filtroTexto.toLowerCase());
    
    const cumpleFiltroEstado = filtroEstado === 'Todos' || turno.estado === filtroEstado;
    
    return cumpleFiltroTexto && cumpleFiltroEstado;
  });

  const renderTurno = ({ item }: { item: TurnoCompleto }) => {
    const estadoStyle = getEstadoColor(item.estado);
    
    return (
      <View style={styles.turnoCard}>
        <View style={styles.turnoHeader}>
          <View>
            <Text style={styles.turnoFecha}>{formatearFecha(item.fecha)}</Text>
            <Text style={styles.turnoHorario}>{item.inicio} - {item.fin}</Text>
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

        <View style={styles.turnoDetalles}>
          <View style={styles.detalleRow}>
            <MaterialCommunityIcons name="login" size={16} color="#059669" />
            <Text style={styles.detalleText}>
              Entrada: {item.entrada || 'No registrada'}
            </Text>
          </View>
          
          <View style={styles.detalleRow}>
            <MaterialCommunityIcons name="logout" size={16} color="#DC2626" />
            <Text style={styles.detalleText}>
              Salida: {item.salida || 'No registrada'}
            </Text>
          </View>
          
          {item.totalVentas !== undefined && (
            <View style={styles.detalleRow}>
              <MaterialCommunityIcons name="cash-multiple" size={16} color="#3B82F6" />
              <Text style={[styles.detalleText, styles.ventasText]}>
                Ventas: {item.totalVentas} Bs
              </Text>
            </View>
          )}
          
          {item.observaciones && (
            <View style={styles.observacionesContainer}>
              <MaterialCommunityIcons name="note-text" size={16} color="#6B7280" />
              <Text style={styles.observacionesText}>{item.observaciones}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderReporte = ({ item }: { item: ReporteDiario }) => {
    const formatearFechaCompleta = (fecha: string) => {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    return (
      <View style={styles.reporteCard}>
        <View style={styles.reporteHeader}>
          <MaterialCommunityIcons name="chart-line" size={24} color="#F59E0B" />
          <Text style={styles.reporteFecha}>{formatearFechaCompleta(item.fecha)}</Text>
        </View>

        <View style={styles.operadorReporte}>
          <MaterialCommunityIcons name="account" size={18} color="#6B7280" />
          <Text style={styles.operadorReporteText}>{item.operador}</Text>
        </View>

        <View style={styles.reporteStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalIngresos} Bs</Text>
            <Text style={styles.statLabel}>Total Ingresos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalServicios}</Text>
            <Text style={styles.statLabel}>Servicios</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.clientesAtendidos}</Text>
            <Text style={styles.statLabel}>Clientes</Text>
          </View>
        </View>

        <View style={styles.serviciosDetalle}>
          <Text style={styles.serviciosDetalleTitle}>Ingresos por servicios:</Text>
          
          <View style={styles.servicioDetalle}>
            <View style={styles.servicioDetalleHeader}>
              <MaterialCommunityIcons name="washing-machine" size={18} color="#3B82F6" />
              <Text style={styles.servicioDetalleNombre}>Lavado</Text>
            </View>
            <View style={styles.servicioDetalleInfo}>
              <Text style={styles.servicioDetalleCantidad}>{item.serviciosPorTipo.lavado.cantidad} servicios</Text>
              <Text style={styles.servicioDetalleIngresos}>{item.serviciosPorTipo.lavado.ingresos} Bs</Text>
            </View>
          </View>

          <View style={styles.servicioDetalle}>
            <View style={styles.servicioDetalleHeader}>
              <MaterialCommunityIcons name="water" size={18} color="#10B981" />
              <Text style={styles.servicioDetalleNombre}>Solo Lavado</Text>
            </View>
            <View style={styles.servicioDetalleInfo}>
              <Text style={styles.servicioDetalleCantidad}>{item.serviciosPorTipo.soloLavado.cantidad} servicios</Text>
              <Text style={styles.servicioDetalleIngresos}>{item.serviciosPorTipo.soloLavado.ingresos} Bs</Text>
            </View>
          </View>

          <View style={styles.servicioDetalle}>
            <View style={styles.servicioDetalleHeader}>
              <MaterialCommunityIcons name="iron" size={18} color="#F59E0B" />
              <Text style={styles.servicioDetalleNombre}>Planchado</Text>
            </View>
            <View style={styles.servicioDetalleInfo}>
              <Text style={styles.servicioDetalleCantidad}>{item.serviciosPorTipo.planchado.cantidad} servicios</Text>
              <Text style={styles.servicioDetalleIngresos}>{item.serviciosPorTipo.planchado.ingresos} Bs</Text>
            </View>
          </View>
        </View>
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
        <Text style={styles.headerTitle}>Historial de Turnos</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Pestañas */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, vistaActual === 'turnos' && styles.tabActive]}
          onPress={() => setVistaActual('turnos')}
        >
          <MaterialCommunityIcons 
            name="clock-outline" 
            size={20} 
            color={vistaActual === 'turnos' ? '#3B82F6' : '#6B7280'} 
          />
          <Text style={[styles.tabText, vistaActual === 'turnos' && styles.tabTextActive]}>
            Turnos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, vistaActual === 'reportes' && styles.tabActive]}
          onPress={() => setVistaActual('reportes')}
        >
          <MaterialCommunityIcons 
            name="chart-line" 
            size={20} 
            color={vistaActual === 'reportes' ? '#3B82F6' : '#6B7280'} 
          />
          <Text style={[styles.tabText, vistaActual === 'reportes' && styles.tabTextActive]}>
            Reportes Diarios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros - Solo mostrar en vista de turnos */}
      {vistaActual === 'turnos' && (
      <View style={styles.filtrosContainer}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por fecha u observaciones..."
            value={filtroTexto}
            onChangeText={setFiltroTexto}
          />
          {filtroTexto.length > 0 && (
            <TouchableOpacity onPress={() => setFiltroTexto('')}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosScroll}
        >
          {filtrosEstado.map((estado) => (
            <TouchableOpacity
              key={estado}
              style={[
                styles.filtroChip,
                filtroEstado === estado && styles.filtroChipActive
              ]}
              onPress={() => setFiltroEstado(estado)}
            >
              <Text style={[
                styles.filtroChipText,
                filtroEstado === estado && styles.filtroChipTextActive
              ]}>
                {estado}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      )}

      {/* Contenido según la vista actual */}
      {vistaActual === 'turnos' ? (
        /* Lista de turnos */
        <FlatList
          data={turnosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderTurno}
          contentContainerStyle={styles.listaContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-remove" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No se encontraron turnos</Text>
            <Text style={styles.emptySubtext}>
              Prueba ajustando los filtros de búsqueda
            </Text>
          </View>
        }
      />
      ) : (
        /* Lista de reportes diarios */
        <FlatList
          data={reportesDiarios}
          keyExtractor={(item) => item.fecha}
          renderItem={renderReporte}
          contentContainerStyle={styles.listaContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="chart-line" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay reportes disponibles</Text>
              <Text style={styles.emptySubtext}>
                Los reportes se generan automáticamente al completar turnos
              </Text>
            </View>
          }
        />
      )}
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
  filtrosContainer: {
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
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filtrosScroll: {
    flexDirection: 'row',
  },
  filtroChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  filtroChipActive: {
    backgroundColor: '#3B82F6',
  },
  filtroChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filtroChipTextActive: {
    color: '#FFFFFF',
  },
  listaContainer: {
    padding: 16,
  },
  turnoCard: {
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
  turnoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  turnoFecha: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  turnoHorario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
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
  turnoDetalles: {
    gap: 6,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detalleText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  ventasText: {
    fontWeight: '600',
    color: '#059669',
  },
  observacionesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  observacionesText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    flex: 1,
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
  // Estilos para pestañas
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
  },
  // Estilos para tarjetas de reportes
  reporteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reporteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reporteFecha: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  operadorReporte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  operadorReporteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  reporteStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  serviciosDetalle: {
    gap: 12,
  },
  serviciosDetalleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  servicioDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  servicioDetalleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servicioDetalleNombre: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  servicioDetalleInfo: {
    alignItems: 'flex-end',
  },
  servicioDetalleCantidad: {
    fontSize: 12,
    color: '#6B7280',
  },
  servicioDetalleIngresos: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});
