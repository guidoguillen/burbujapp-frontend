import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface MovimientoCaja {
  id: string;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  operador: string;
  fecha: string;
  categoria: 'servicio' | 'gasto' | 'comision' | 'otro';
  ordenId?: string;
}

interface ResumenFinanciero {
  totalIngresos: number;
  totalEgresos: number;
  ventasPorMetodo: {
    efectivo: number;
    tarjeta: number;
    transferencia: number;
  };
  comisionesPorOperador: {
    operador: string;
    ventas: number;
    comision: number;
    porcentaje: number;
  }[];
}

export const ControlFinancieroScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [modalMovimientos, setModalMovimientos] = useState(false);
  const [modalComisiones, setModalComisiones] = useState(false);
  const [modalGastos, setModalGastos] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('hoy');

  // Mock de movimientos de caja
  const [movimientos] = useState<MovimientoCaja[]>([
    {
      id: '1',
      tipo: 'ingreso',
      concepto: 'Lavado y planchado - Orden #ABC123',
      monto: 85,
      metodoPago: 'efectivo',
      operador: 'María González',
      fecha: '2025-08-07T10:30:00',
      categoria: 'servicio',
      ordenId: 'ABC123'
    },
    {
      id: '2',
      tipo: 'ingreso',
      concepto: 'Tintorería - Orden #DEF456',
      monto: 120,
      metodoPago: 'tarjeta',
      operador: 'Carlos Mendoza',
      fecha: '2025-08-07T11:15:00',
      categoria: 'servicio',
      ordenId: 'DEF456'
    },
    {
      id: '3',
      tipo: 'egreso',
      concepto: 'Compra de detergente',
      monto: 45,
      metodoPago: 'efectivo',
      operador: 'Admin',
      fecha: '2025-08-07T09:00:00',
      categoria: 'gasto'
    },
    {
      id: '4',
      tipo: 'ingreso',
      concepto: 'Lavado express - Orden #GHI789',
      monto: 60,
      metodoPago: 'transferencia',
      operador: 'Ana Vargas',
      fecha: '2025-08-07T14:20:00',
      categoria: 'servicio',
      ordenId: 'GHI789'
    },
    {
      id: '5',
      tipo: 'egreso',
      concepto: 'Comisión María González',
      monto: 25,
      metodoPago: 'efectivo',
      operador: 'Admin',
      fecha: '2025-08-07T18:00:00',
      categoria: 'comision'
    }
  ]);

  // Mock de resumen financiero
  const [resumenFinanciero] = useState<ResumenFinanciero>({
    totalIngresos: 2450,
    totalEgresos: 320,
    ventasPorMetodo: {
      efectivo: 1200,
      tarjeta: 850,
      transferencia: 400
    },
    comisionesPorOperador: [
      { operador: 'María González', ventas: 890, comision: 89, porcentaje: 10 },
      { operador: 'Carlos Mendoza', ventas: 750, comision: 75, porcentaje: 10 },
      { operador: 'Ana Vargas', ventas: 450, comision: 45, porcentaje: 10 }
    ]
  });

  const getTipoColor = (tipo: 'ingreso' | 'egreso') => {
    return tipo === 'ingreso'
      ? { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'arrow-up' as const }
      : { backgroundColor: '#FEE2E2', color: '#DC2626', icon: 'arrow-down' as const };
  };

  const getMetodoPagoIcon = (metodo: string) => {
    switch (metodo) {
      case 'efectivo': return 'cash';
      case 'tarjeta': return 'credit-card';
      case 'transferencia': return 'bank-transfer';
      default: return 'currency-usd';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'servicio': return { backgroundColor: '#EBF8FF', color: '#3B82F6' };
      case 'gasto': return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      case 'comision': return { backgroundColor: '#F3E8FF', color: '#8B5CF6' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularBalance = () => {
    return resumenFinanciero.totalIngresos - resumenFinanciero.totalEgresos;
  };

  const exportarReporte = () => {
    Alert.alert(
      '📊 Exportar Reporte Financiero',
      'Seleccione el formato de exportación:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excel', onPress: () => Alert.alert('✅ Éxito', 'Reporte exportado a Excel') },
        { text: 'PDF', onPress: () => Alert.alert('✅ Éxito', 'Reporte exportado a PDF') }
      ]
    );
  };

  const renderMovimiento = ({ item }: { item: MovimientoCaja }) => {
    const tipoStyle = getTipoColor(item.tipo);
    const categoriaStyle = getCategoriaColor(item.categoria);
    
    return (
      <View style={styles.movimientoCard}>
        <View style={styles.movimientoHeader}>
          <View style={styles.movimientoInfo}>
            <Text style={styles.movimientoConcepto}>{item.concepto}</Text>
            <Text style={styles.movimientoOperador}>👤 {item.operador}</Text>
            <Text style={styles.movimientoFecha}>🕒 {formatearFecha(item.fecha)}</Text>
          </View>
          
          <View style={styles.movimientoMonto}>
            <View style={[styles.badge, { backgroundColor: tipoStyle.backgroundColor }]}>
              <MaterialCommunityIcons name={tipoStyle.icon} size={14} color={tipoStyle.color} />
              <Text style={[styles.badgeText, { color: tipoStyle.color }]}>
                {item.tipo === 'ingreso' ? '+' : '-'}${item.monto}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.movimientoDetalles}>
          <View style={[styles.metodoPagoTag, categoriaStyle]}>
            <MaterialCommunityIcons 
              name={getMetodoPagoIcon(item.metodoPago) as any} 
              size={12} 
              color={categoriaStyle.color} 
            />
            <Text style={[styles.metodoPagoText, { color: categoriaStyle.color }]}>
              {item.metodoPago}
            </Text>
          </View>
          
          <View style={[styles.categoriaTag, categoriaStyle]}>
            <Text style={[styles.categoriaText, { color: categoriaStyle.color }]}>
              {item.categoria}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderComision = ({ item }: { item: any }) => {
    return (
      <View style={styles.comisionCard}>
        <View style={styles.comisionHeader}>
          <Text style={styles.comisionOperador}>{item.operador}</Text>
          <Text style={styles.comisionPorcentaje}>{item.porcentaje}%</Text>
        </View>
        
        <View style={styles.comisionStats}>
          <View style={styles.comisionStat}>
            <Text style={styles.comisionStatNumber}>${item.ventas}</Text>
            <Text style={styles.comisionStatLabel}>Ventas</Text>
          </View>
          <View style={styles.comisionStat}>
            <Text style={styles.comisionStatNumber}>${item.comision}</Text>
            <Text style={styles.comisionStatLabel}>Comisión</Text>
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
        <Text style={styles.headerTitle}>Control Financiero</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={exportarReporte}>
          <MaterialCommunityIcons name="file-export" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        {/* Resumen del día */}
        <View style={styles.resumenContainer}>
          <Text style={styles.sectionTitle}>💰 Resumen del Día</Text>
          <View style={styles.resumenGrid}>
            <View style={styles.resumenCard}>
              <MaterialCommunityIcons name="trending-up" size={24} color="#10B981" />
              <Text style={styles.resumenNumber}>${resumenFinanciero.totalIngresos}</Text>
              <Text style={styles.resumenLabel}>Ingresos</Text>
            </View>
            
            <View style={styles.resumenCard}>
              <MaterialCommunityIcons name="trending-down" size={24} color="#EF4444" />
              <Text style={styles.resumenNumber}>${resumenFinanciero.totalEgresos}</Text>
              <Text style={styles.resumenLabel}>Egresos</Text>
            </View>
            
            <View style={styles.resumenCard}>
              <MaterialCommunityIcons name="calculator" size={24} color="#3B82F6" />
              <Text style={[styles.resumenNumber, { color: calcularBalance() >= 0 ? '#10B981' : '#EF4444' }]}>
                ${calcularBalance()}
              </Text>
              <Text style={styles.resumenLabel}>Balance</Text>
            </View>
          </View>
        </View>

        {/* Ventas por método de pago */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>💳 Ventas por Método de Pago</Text>
          <View style={styles.metodosGrid}>
            <View style={styles.metodoCard}>
              <MaterialCommunityIcons name="cash" size={20} color="#10B981" />
              <Text style={styles.metodoMonto}>${resumenFinanciero.ventasPorMetodo.efectivo}</Text>
              <Text style={styles.metodoLabel}>Efectivo</Text>
            </View>
            
            <View style={styles.metodoCard}>
              <MaterialCommunityIcons name="credit-card" size={20} color="#3B82F6" />
              <Text style={styles.metodoMonto}>${resumenFinanciero.ventasPorMetodo.tarjeta}</Text>
              <Text style={styles.metodoLabel}>Tarjeta</Text>
            </View>
            
            <View style={styles.metodoCard}>
              <MaterialCommunityIcons name="bank-transfer" size={20} color="#8B5CF6" />
              <Text style={styles.metodoMonto}>${resumenFinanciero.ventasPorMetodo.transferencia}</Text>
              <Text style={styles.metodoLabel}>Transferencia</Text>
            </View>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🚀 Acciones Rápidas</Text>
          <View style={styles.accionesGrid}>
            <TouchableOpacity 
              style={styles.accionCard}
              onPress={() => setModalMovimientos(true)}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#3B82F6" />
              <Text style={styles.accionText}>Ver Movimientos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.accionCard}
              onPress={() => setModalComisiones(true)}
            >
              <MaterialCommunityIcons name="percent" size={24} color="#8B5CF6" />
              <Text style={styles.accionText}>Comisiones</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.accionCard}
              onPress={() => setModalGastos(true)}
            >
              <MaterialCommunityIcons name="receipt" size={24} color="#EF4444" />
              <Text style={styles.accionText}>Registrar Gasto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.accionCard}
              onPress={() => Alert.alert('Cierre de Caja', 'Funcionalidad de cierre de caja del día')}
            >
              <MaterialCommunityIcons name="lock" size={24} color="#F59E0B" />
              <Text style={styles.accionText}>Cierre de Caja</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal Movimientos */}
      <Modal
        visible={modalMovimientos}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalMovimientos(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📋 Movimientos del Día</Text>
              <TouchableOpacity onPress={() => setModalMovimientos(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={movimientos}
              keyExtractor={(item) => item.id}
              renderItem={renderMovimiento}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Comisiones */}
      <Modal
        visible={modalComisiones}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalComisiones(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💼 Comisiones por Operador</Text>
              <TouchableOpacity onPress={() => setModalComisiones(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={resumenFinanciero.comisionesPorOperador}
              keyExtractor={(item) => item.operador}
              renderItem={renderComision}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Gastos */}
      <Modal
        visible={modalGastos}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGastos(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🧾 Registrar Nuevo Gasto</Text>
              <TouchableOpacity onPress={() => setModalGastos(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.gastoForm}>
                <TouchableOpacity style={styles.gastoBtn}>
                  <MaterialCommunityIcons name="shopping" size={20} color="#3B82F6" />
                  <Text style={styles.gastoBtnText}>Compra de Suministros</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.gastoBtn}>
                  <MaterialCommunityIcons name="wrench" size={20} color="#F59E0B" />
                  <Text style={styles.gastoBtnText}>Mantenimiento</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.gastoBtn}>
                  <MaterialCommunityIcons name="lightning-bolt" size={20} color="#EF4444" />
                  <Text style={styles.gastoBtnText}>Servicios Básicos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.gastoBtn}>
                  <MaterialCommunityIcons name="account-cash" size={20} color="#8B5CF6" />
                  <Text style={styles.gastoBtnText}>Pago de Salarios</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.gastoBtn}>
                  <MaterialCommunityIcons name="file-document" size={20} color="#10B981" />
                  <Text style={styles.gastoBtnText}>Otros Gastos</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  exportBtn: {
    padding: 8,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resumenContainer: {
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
  resumenGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  resumenCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  resumenNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4,
  },
  resumenLabel: {
    fontSize: 12,
    color: '#6B7280',
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
  metodosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  metodoCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metodoMonto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  metodoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  accionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  accionCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  accionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 6,
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
  movimientoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  movimientoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  movimientoInfo: {
    flex: 1,
    marginRight: 12,
  },
  movimientoConcepto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  movimientoOperador: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  movimientoFecha: {
    fontSize: 12,
    color: '#6B7280',
  },
  movimientoMonto: {
    alignItems: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  movimientoDetalles: {
    flexDirection: 'row',
    gap: 8,
  },
  metodoPagoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  metodoPagoText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  categoriaTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoriaText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  comisionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  comisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  comisionOperador: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  comisionPorcentaje: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  comisionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comisionStat: {
    alignItems: 'center',
  },
  comisionStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  comisionStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  gastoForm: {
    gap: 12,
  },
  gastoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  gastoBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
