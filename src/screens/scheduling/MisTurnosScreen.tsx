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
  
  // Estadísticas del día (mock - en app real vendría de API)
  const [estadisticasDelDia] = useState({
    ordenesHoy: 12,
    ordenesEnProceso: 4,
    ventasHoy: 420,
    clientesAtendidos: 8,
    ordenesPendientes: 3,
    ordenesTerminadas: 5
  });
  
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
        return 'clock-time-four';
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
        {/* Resumen del Día */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Resumen del Día</Text>
          
          <View style={styles.resumenContainer}>
            <View style={styles.resumenGrid}>
              <View style={styles.resumenCard}>
                <View style={[styles.resumenIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="clipboard-list" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.resumenNumber}>{estadisticasDelDia.ordenesHoy}</Text>
                <Text style={styles.resumenLabel}>Órdenes hoy</Text>
              </View>

              <View style={styles.resumenCard}>
                <View style={[styles.resumenIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="clock-time-four" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.resumenNumber}>{estadisticasDelDia.ordenesEnProceso}</Text>
                <Text style={styles.resumenLabel}>En proceso</Text>
              </View>

              <View style={styles.resumenCard}>
                <View style={[styles.resumenIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="cash-multiple" size={20} color="#059669" />
                </View>
                <Text style={styles.resumenNumber}>${estadisticasDelDia.ventasHoy}</Text>
                <Text style={styles.resumenLabel}>Ventas hoy</Text>
              </View>

              <View style={styles.resumenCard}>
                <View style={[styles.resumenIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="account-group" size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.resumenNumber}>{estadisticasDelDia.clientesAtendidos}</Text>
                <Text style={styles.resumenLabel}>Clientes</Text>
              </View>

              <View style={styles.resumenCard}>
                <View style={[styles.resumenIconContainer, { backgroundColor: '#FECACA' }]}>
                  <MaterialCommunityIcons name="clock-alert" size={20} color="#DC2626" />
                </View>
                <Text style={styles.resumenNumber}>{estadisticasDelDia.ordenesPendientes}</Text>
                <Text style={styles.resumenLabel}>Pendientes</Text>
              </View>

              <View style={styles.resumenCard}>
                <View style={[styles.resumenIconContainer, { backgroundColor: '#DCFCE7' }]}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#16A34A" />
                </View>
                <Text style={styles.resumenNumber}>{estadisticasDelDia.ordenesTerminadas}</Text>
                <Text style={styles.resumenLabel}>Terminadas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progreso del Turno */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱ Progreso del Turno</Text>
          
          <View style={styles.progresoContainer}>
            <View style={styles.progresoHeader}>
              <Text style={styles.progresoTitulo}>Para cerrar el turno debes:</Text>
            </View>
            
            <View style={styles.progresoListaContainer}>
              <View style={styles.progresoItem}>
                <MaterialCommunityIcons 
                  name={turnoActual.entrada ? "check-circle" : "circle-outline"} 
                  size={20} 
                  color={turnoActual.entrada ? "#059669" : "#9CA3AF"} 
                />
                <Text style={[
                  styles.progresoTexto,
                  turnoActual.entrada && styles.progresoTextoCompletado
                ]}>
                  Registrar entrada ✓
                </Text>
              </View>

              <View style={styles.progresoItem}>
                <MaterialCommunityIcons 
                  name={turnoActual.salida ? "check-circle" : "circle-outline"} 
                  size={20} 
                  color={turnoActual.salida ? "#059669" : "#9CA3AF"} 
                />
                <Text style={[
                  styles.progresoTexto,
                  turnoActual.salida && styles.progresoTextoCompletado
                ]}>
                  Procesar órdenes del día
                </Text>
              </View>

              <View style={styles.progresoItem}>
                <MaterialCommunityIcons 
                  name={turnoActual.salida ? "check-circle" : "circle-outline"} 
                  size={20} 
                  color={turnoActual.salida ? "#059669" : "#9CA3AF"} 
                />
                <Text style={[
                  styles.progresoTexto,
                  turnoActual.salida && styles.progresoTextoCompletado
                ]}>
                  Registrar salida y caja final
                </Text>
              </View>

              <View style={styles.progresoItem}>
                <MaterialCommunityIcons 
                  name={turnoActual.salida ? "check-circle" : "circle-outline"} 
                  size={20} 
                  color={turnoActual.salida ? "#059669" : "#9CA3AF"} 
                />
                <Text style={[
                  styles.progresoTexto,
                  turnoActual.salida && styles.progresoTextoCompletado
                ]}>
                  Ver resumen y enviar reporte
                </Text>
              </View>
            </View>

            {turnoActual.entrada && !turnoActual.salida && (
              <View style={styles.progresoBadge}>
                <Text style={styles.progresoEstado}>
                  🔄 Turno en progreso - Puedes seguir trabajando
                </Text>
              </View>
            )}

            {turnoActual.salida && (
              <View style={[styles.progresoBadge, { backgroundColor: '#D1FAE5' }]}>
                <Text style={[styles.progresoEstado, { color: '#065F46' }]}>
                  ✅ Turno completado - ¡Buen trabajo!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Acciones Rápidas */}
        {turnoActual.entrada && !turnoActual.salida && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
            
            <View style={styles.accionesContainer}>
              <TouchableOpacity style={styles.accionBoton}>
                <MaterialCommunityIcons name="plus-circle" size={24} color="#3B82F6" />
                <Text style={styles.accionTexto}>Nueva Orden</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accionBoton}>
                <MaterialCommunityIcons name="clock-check" size={24} color="#059669" />
                <Text style={styles.accionTexto}>Ver Programados</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accionBoton}>
                <MaterialCommunityIcons name="cash-register" size={24} color="#DC2626" />
                <Text style={styles.accionTexto}>Registrar Venta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accionBoton}>
                <MaterialCommunityIcons name="chart-line" size={24} color="#7C3AED" />
                <Text style={styles.accionTexto}>Ver Métricas</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
                  <MaterialCommunityIcons name="cash-multiple" size={16} color="#3B82F6" />
                  <Text style={styles.detalleText}>
                    Caja inicial: {turnoActual.cajaInicial} Bs
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.controlTurnoBtn,
                { backgroundColor: turnoActual.salida ? '#059669' : '#DC2626' }
              ]} 
              onPress={() => navigation.navigate('Turno')}
            >
              <MaterialCommunityIcons 
                name={turnoActual.salida ? "check-circle" : "logout"} 
                size={20} 
                color="#FFFFFF" 
              />
              <View style={styles.controlTurnoBtnContent}>
                <Text style={styles.controlTurnoBtnText}>
                  {turnoActual.salida ? "Ver Resumen del Turno" : "Finalizar Turno & Ver Resumen"}
                </Text>
                <Text style={styles.controlTurnoBtnSubtext}>
                  {turnoActual.salida 
                    ? "Turno completado - revisar estadísticas"
                    : `${estadisticasDelDia.ordenesHoy} órdenes procesadas hoy`
                  }
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#FFFFFF" />
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
  // Estilos para Resumen del Día
  resumenContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resumenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resumenCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  resumenIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resumenNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  resumenLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Estilos para el progreso del turno
  progresoContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  progresoHeader: {
    marginBottom: 16,
  },
  progresoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progresoListaContainer: {
    gap: 12,
  },
  progresoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  progresoTexto: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  progresoTextoCompletado: {
    color: '#059669',
    fontWeight: '500',
  },
  progresoBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  progresoEstado: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4338CA',
    textAlign: 'center',
  },

  // Estilos para acciones rápidas
  accionesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  accionBoton: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accionTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  // Estilos adicionales para el botón de control del turno
  controlTurnoBtnContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  controlTurnoBtnSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
