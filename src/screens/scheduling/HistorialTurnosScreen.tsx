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

export const HistorialTurnosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  
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
        return { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'clock-check' as const };
      case 'Finalizado':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'check-circle' as const };
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

      {/* Filtros */}
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

      {/* Lista de turnos */}
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
});
