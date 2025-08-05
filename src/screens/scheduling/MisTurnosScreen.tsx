import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Turnos'>;

interface TurnoHistorial {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
  estado: 'Pendiente' | 'En curso' | 'Finalizado';
  entrada?: string;
  salida?: string;
  cajaInicial?: number;
  cajaFinal?: number;
  totalVentas?: number;
}

export const MisTurnosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // Datos mock del turno actual y historial
  const [turnoActual] = useState<TurnoHistorial>({
    id: '1',
    fecha: '2025-08-05',
    inicio: '08:00',
    fin: '16:00',
    estado: 'En curso',
    entrada: '08:03',
    cajaInicial: 150,
  });

  const [historialTurnos] = useState<TurnoHistorial[]>([
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
  ]);

  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return `${dias[date.getDay()]} ${date.getDate()} ${meses[date.getMonth()]}`;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'En curso':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'Finalizado':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'clock-outline';
      case 'En curso':
        return 'clock-check';
      case 'Finalizado':
        return 'check-circle';
      default:
        return 'clock-outline';
    }
  };

  const renderTurnoHistorial = ({ item }: { item: TurnoHistorial }) => {
    const estadoStyle = getEstadoColor(item.estado);
    
    return (
      <View style={styles.historialCard}>
        <View style={styles.historialHeader}>
          <Text style={styles.historialFecha}>{formatearFecha(item.fecha)}</Text>
          <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.backgroundColor }]}>
            <MaterialCommunityIcons 
              name={getEstadoIcon(item.estado)} 
              size={12} 
              color={estadoStyle.color} 
            />
            <Text style={[styles.estadoText, { color: estadoStyle.color }]}>
              {item.estado}
            </Text>
          </View>
        </View>
        
        <Text style={styles.historialHorario}>
          {item.inicio} - {item.fin}
        </Text>
        
        <View style={styles.historialDetalles}>
          <Text style={styles.historialDetalle}>
            Entrada: {item.entrada || '--'} | Salida: {item.salida || '--'}
          </Text>
          {item.totalVentas !== undefined && (
            <Text style={styles.historialVentas}>
              Ventas: {item.totalVentas} Bs ✅
            </Text>
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
        <Text style={styles.headerTitle}>Mis Turnos</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Turno Actual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 Turno Actual</Text>
          
          <View style={styles.turnoActualCard}>
            <View style={styles.turnoActualHeader}>
              <View>
                <Text style={styles.turnoActualFecha}>
                  📅 {formatearFecha(turnoActual.fecha)}
                </Text>
                <Text style={styles.turnoActualHorario}>
                  {turnoActual.inicio} - {turnoActual.fin}
                </Text>
              </View>
              
              <View style={[styles.estadoBadgeLarge, getEstadoColor(turnoActual.estado)]}>
                <MaterialCommunityIcons 
                  name={getEstadoIcon(turnoActual.estado)} 
                  size={16} 
                  color={getEstadoColor(turnoActual.estado).color} 
                />
                <Text style={[styles.estadoTextLarge, { color: getEstadoColor(turnoActual.estado).color }]}>
                  {turnoActual.estado}
                </Text>
              </View>
            </View>

            <View style={styles.turnoActualDetalles}>
              <View style={styles.detalleRow}>
                <MaterialCommunityIcons name="login" size={16} color="#059669" />
                <Text style={styles.detalleText}>
                  Entrada: {turnoActual.entrada || 'No registrada'}
                </Text>
              </View>
              
              <View style={styles.detalleRow}>
                <MaterialCommunityIcons name="logout" size={16} color="#DC2626" />
                <Text style={styles.detalleText}>
                  Salida: {turnoActual.salida || 'Pendiente'}
                </Text>
              </View>
              
              {turnoActual.cajaInicial && (
                <View style={styles.detalleRow}>
                  <MaterialCommunityIcons name="cash" size={16} color="#3B82F6" />
                  <Text style={styles.detalleText}>
                    Caja inicial: {turnoActual.cajaInicial} Bs
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.controlTurnoBtn} 
              onPress={() => navigation.navigate('Turno')}
            >
              <MaterialCommunityIcons name="clipboard-clock" size={20} color="#FFFFFF" />
              <Text style={styles.controlTurnoBtnText}>Ver Control de Turno</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Historial de Turnos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Turnos Recientes</Text>
          
          {historialTurnos.map((turno) => (
            <View key={turno.id}>
              {renderTurnoHistorial({ item: turno })}
            </View>
          ))}
        </View>

        {/* Botón Historial Completo */}
        <TouchableOpacity 
          style={styles.historialCompletoBtn}
          onPress={() => navigation.navigate('HistorialTurnos')}
        >
          <MaterialCommunityIcons name="folder-open" size={20} color="#3B82F6" />
          <Text style={styles.historialCompletoBtnText}>Ver historial completo</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  turnoActualCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  turnoActualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  turnoActualFecha: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  turnoActualHorario: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  estadoBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  estadoTextLarge: {
    fontSize: 14,
    fontWeight: '700',
  },
  turnoActualDetalles: {
    gap: 8,
    marginBottom: 16,
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
  controlTurnoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  controlTurnoBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  historialCard: {
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
  historialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historialFecha: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  historialHorario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  historialDetalles: {
    gap: 4,
  },
  historialDetalle: {
    fontSize: 14,
    color: '#6B7280',
  },
  historialVentas: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  historialCompletoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historialCompletoBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    flex: 1,
    textAlign: 'center',
  },
});
