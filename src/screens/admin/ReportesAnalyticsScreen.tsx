import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface VentasAnalytics {
  ventas: {
    hoy: number;
    ayer: number;
    semana: number;
    mes: number;
    crecimiento: number;
  };
  serviciosPopulares: {
    servicio: string;
    cantidad: number;
    ingresos: number;
    porcentaje: number;
  }[];
  clientesFrecuentes: {
    nombre: string;
    telefono: string;
    ordenes: number;
    totalGastado: number;
    ultimaVisita: string;
  }[];
  tendenciasPorHora: {
    hora: string;
    ordenes: number;
  }[];
}

interface ReporteConfiguracion {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  tipo: 'ventas' | 'clientes' | 'operacional' | 'financiero';
}

export const ReportesAnalyticsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [modalReporte, setModalReporte] = useState(false);
  const [modalClientes, setModalClientes] = useState(false);
  const [modalServicios, setModalServicios] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<ReporteConfiguracion | null>(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');

  // Mock de analytics de ventas
  const [ventasAnalytics] = useState<VentasAnalytics>({
    ventas: {
      hoy: 2450,
      ayer: 2180,
      semana: 15680,
      mes: 67890,
      crecimiento: 12.4
    },
    serviciosPopulares: [
      { servicio: 'Lavado y Planchado', cantidad: 45, ingresos: 2250, porcentaje: 35 },
      { servicio: 'Tintorería', cantidad: 28, ingresos: 3360, porcentaje: 25 },
      { servicio: 'Lavado Express', cantidad: 32, ingresos: 1920, porcentaje: 20 },
      { servicio: 'Planchado Premium', cantidad: 18, ingresos: 1440, porcentaje: 15 },
      { servicio: 'Limpieza de Alfombras', cantidad: 8, ingresos: 1200, porcentaje: 5 }
    ],
    clientesFrecuentes: [
      { nombre: 'María Elena García', telefono: '77712345', ordenes: 24, totalGastado: 1890, ultimaVisita: '2025-08-06' },
      { nombre: 'Carlos Mendoza López', telefono: '68823456', ordenes: 19, totalGastado: 1520, ultimaVisita: '2025-08-07' },
      { nombre: 'Ana Patricia Vargas', telefono: '79934567', ordenes: 16, totalGastado: 1280, ultimaVisita: '2025-08-05' },
      { nombre: 'Luis Fernando Cruz', telefono: '75645678', ordenes: 14, totalGastado: 1120, ultimaVisita: '2025-08-04' },
      { nombre: 'Patricia Morales', telefono: '69756789', ordenes: 12, totalGastado: 960, ultimaVisita: '2025-08-03' }
    ],
    tendenciasPorHora: [
      { hora: '08:00', ordenes: 3 },
      { hora: '09:00', ordenes: 8 },
      { hora: '10:00', ordenes: 12 },
      { hora: '11:00', ordenes: 15 },
      { hora: '12:00', ordenes: 10 },
      { hora: '13:00', ordenes: 6 },
      { hora: '14:00', ordenes: 14 },
      { hora: '15:00', ordenes: 18 },
      { hora: '16:00', ordenes: 16 },
      { hora: '17:00', ordenes: 11 },
      { hora: '18:00', ordenes: 7 },
      { hora: '19:00', ordenes: 4 }
    ]
  });

  // Mock de configuraciones de reportes
  const [reportesDisponibles] = useState<ReporteConfiguracion[]>([
    {
      id: '1',
      nombre: 'Reporte de Ventas Diarias',
      descripcion: 'Análisis detallado de ventas por día',
      icono: 'chart-line',
      color: '#3B82F6',
      tipo: 'ventas'
    },
    {
      id: '2',
      nombre: 'Análisis de Clientes',
      descripcion: 'Comportamiento y frecuencia de clientes',
      icono: 'account-group',
      color: '#8B5CF6',
      tipo: 'clientes'
    },
    {
      id: '3',
      nombre: 'Rentabilidad por Servicio',
      descripcion: 'Análisis de rentabilidad de cada servicio',
      icono: 'washing-machine',
      color: '#10B981',
      tipo: 'operacional'
    },
    {
      id: '4',
      nombre: 'Reporte Financiero Mensual',
      descripcion: 'Estado financiero completo del mes',
      icono: 'file-chart',
      color: '#F59E0B',
      tipo: 'financiero'
    },
    {
      id: '5',
      nombre: 'Análisis de Tendencias',
      descripcion: 'Tendencias de demanda por horarios',
      icono: 'trending-up',
      color: '#EF4444',
      tipo: 'operacional'
    },
    {
      id: '6',
      nombre: 'Comparativo Mensual',
      descripcion: 'Comparación mes a mes de indicadores',
      icono: 'compare',
      color: '#6366F1',
      tipo: 'ventas'
    }
  ]);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'ventas': return { backgroundColor: '#EBF8FF', color: '#3B82F6' };
      case 'clientes': return { backgroundColor: '#F3E8FF', color: '#8B5CF6' };
      case 'operacional': return { backgroundColor: '#ECFDF5', color: '#10B981' };
      case 'financiero': return { backgroundColor: '#FEF3C7', color: '#F59E0B' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const generarReporte = (reporte: ReporteConfiguracion) => {
    Alert.alert(
      `📊 ${reporte.nombre}`,
      'Seleccione el formato de exportación:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'PDF', onPress: () => Alert.alert('✅ Éxito', `Reporte ${reporte.nombre} generado en PDF`) },
        { text: 'Excel', onPress: () => Alert.alert('✅ Éxito', `Reporte ${reporte.nombre} generado en Excel`) }
      ]
    );
  };

  const renderReporte = ({ item }: { item: ReporteConfiguracion }) => {
    const tipoStyle = getTipoColor(item.tipo);
    
    return (
      <TouchableOpacity 
        style={styles.reporteCard}
        onPress={() => generarReporte(item)}
      >
        <View style={styles.reporteHeader}>
          <View style={[styles.reporteIcon, { backgroundColor: tipoStyle.backgroundColor }]}>
            <MaterialCommunityIcons name={item.icono as any} size={24} color={item.color} />
          </View>
          
          <View style={styles.reporteInfo}>
            <Text style={styles.reporteNombre}>{item.nombre}</Text>
            <Text style={styles.reporteDescripcion}>{item.descripcion}</Text>
          </View>
        </View>
        
        <View style={styles.reporteActions}>
          <View style={[styles.tipoTag, tipoStyle]}>
            <Text style={[styles.tipoText, { color: tipoStyle.color }]}>
              {item.tipo}
            </Text>
          </View>
          
          <MaterialCommunityIcons name="download" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderServicioPopular = ({ item }: { item: any }) => {
    return (
      <View style={styles.servicioCard}>
        <View style={styles.servicioInfo}>
          <Text style={styles.servicioNombre}>{item.servicio}</Text>
          <Text style={styles.servicioStats}>
            {item.cantidad} órdenes • ${item.ingresos} ingresos
          </Text>
        </View>
        
        <View style={styles.servicioMeta}>
          <Text style={styles.servicioPorcentaje}>{item.porcentaje}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.porcentaje}%` }]} />
          </View>
        </View>
      </View>
    );
  };

  const renderClienteFrecuente = ({ item }: { item: any }) => {
    return (
      <View style={styles.clienteCard}>
        <View style={styles.clienteInfo}>
          <Text style={styles.clienteNombre}>{item.nombre}</Text>
          <Text style={styles.clienteTelefono}>📞 {item.telefono}</Text>
          <Text style={styles.clienteUltimaVisita}>
            Última visita: {formatearFecha(item.ultimaVisita)}
          </Text>
        </View>
        
        <View style={styles.clienteStats}>
          <View style={styles.clienteStat}>
            <Text style={styles.clienteStatNumber}>{item.ordenes}</Text>
            <Text style={styles.clienteStatLabel}>Órdenes</Text>
          </View>
          <View style={styles.clienteStat}>
            <Text style={styles.clienteStatNumber}>${item.totalGastado}</Text>
            <Text style={styles.clienteStatLabel}>Total</Text>
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
        <Text style={styles.headerTitle}>Reportes y Analytics</Text>
        <TouchableOpacity 
          style={styles.configBtn} 
          onPress={() => Alert.alert('Configuración', 'Configurar parámetros de reportes')}
        >
          <MaterialCommunityIcons name="cog" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        {/* Métricas principales */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>📈 Métricas Principales</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <MaterialCommunityIcons name="currency-usd" size={24} color="#10B981" />
              <Text style={styles.metricNumber}>${ventasAnalytics.ventas.hoy}</Text>
              <Text style={styles.metricLabel}>Ventas Hoy</Text>
              <Text style={[styles.metricChange, { color: '#10B981' }]}>
                +{ventasAnalytics.ventas.crecimiento}%
              </Text>
            </View>
            
            <View style={styles.metricCard}>
              <MaterialCommunityIcons name="calendar-week" size={24} color="#3B82F6" />
              <Text style={styles.metricNumber}>${ventasAnalytics.ventas.semana}</Text>
              <Text style={styles.metricLabel}>Esta Semana</Text>
              <Text style={[styles.metricChange, { color: '#3B82F6' }]}>
                vs. ${ventasAnalytics.ventas.ayer} ayer
              </Text>
            </View>
            
            <View style={styles.metricCard}>
              <MaterialCommunityIcons name="calendar-month" size={24} color="#8B5CF6" />
              <Text style={styles.metricNumber}>${ventasAnalytics.ventas.mes}</Text>
              <Text style={styles.metricLabel}>Este Mes</Text>
              <Text style={[styles.metricChange, { color: '#8B5CF6' }]}>
                Crecimiento sostenido
              </Text>
            </View>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🚀 Análisis Rápido</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setModalServicios(true)}
            >
              <MaterialCommunityIcons name="washing-machine" size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Servicios Populares</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setModalClientes(true)}
            >
              <MaterialCommunityIcons name="account-star" size={24} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Clientes Frecuentes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Tendencias', 'Análisis de tendencias por horarios y días')}
            >
              <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="#F59E0B" />
              <Text style={styles.quickActionText}>Tendencias</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Comparativo', 'Comparación de períodos anteriores')}
            >
              <MaterialCommunityIcons name="compare" size={24} color="#EF4444" />
              <Text style={styles.quickActionText}>Comparativo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reportes disponibles */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>📊 Reportes Disponibles</Text>
          <FlatList
            data={reportesDisponibles}
            keyExtractor={(item) => item.id}
            renderItem={renderReporte}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Modal Servicios Populares */}
      <Modal
        visible={modalServicios}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalServicios(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏆 Servicios Más Populares</Text>
              <TouchableOpacity onPress={() => setModalServicios(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={ventasAnalytics.serviciosPopulares}
              keyExtractor={(item) => item.servicio}
              renderItem={renderServicioPopular}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Clientes Frecuentes */}
      <Modal
        visible={modalClientes}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalClientes(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⭐ Clientes Frecuentes</Text>
              <TouchableOpacity onPress={() => setModalClientes(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={ventasAnalytics.clientesFrecuentes}
              keyExtractor={(item) => item.telefono}
              renderItem={renderClienteFrecuente}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
  backBtn: {
    padding: 8,
  },
  configBtn: {
    padding: 8,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  metricsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  metricChange: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 6,
  },
  reporteCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reporteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reporteIcon: {
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  reporteInfo: {
    flex: 1,
  },
  reporteNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  reporteDescripcion: {
    fontSize: 12,
    color: '#6B7280',
  },
  reporteActions: {
    alignItems: 'center',
    gap: 8,
  },
  tipoTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tipoText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    padding: 20,
  },
  servicioCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicioInfo: {
    flex: 1,
  },
  servicioNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  servicioStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  servicioMeta: {
    alignItems: 'center',
    minWidth: 60,
  },
  servicioPorcentaje: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  progressBar: {
    width: 50,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  clienteCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  clienteTelefono: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  clienteUltimaVisita: {
    fontSize: 12,
    color: '#6B7280',
  },
  clienteStats: {
    flexDirection: 'row',
    gap: 16,
  },
  clienteStat: {
    alignItems: 'center',
  },
  clienteStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  clienteStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
});
