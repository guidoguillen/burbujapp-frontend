import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { globalStyles } from '../../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout, state } = useAuth();
  
  // Estados para modales
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQROptions, setShowQROptions] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Estadísticas mock (en una app real vendrían de una API)
  const estadisticas = {
    ordenesHoy: 8,
    ordenesEnProceso: 3,
    ventasHoy: 280,
    clientesAtendidos: 6,
    inventarioBajo: 5,
    cajaDelDia: 1250
  };

  // Notificaciones mock
  const notificaciones = [
    { 
      id: 1, 
      tipo: 'delivery', 
      mensaje: 'Orden #123 lista para entrega',
      tiempo: '5 min',
      urgente: true,
      icono: 'truck-delivery'
    },
    { 
      id: 2, 
      tipo: 'seguimiento', 
      mensaje: 'Cliente Juan Pérez requiere seguimiento',
      tiempo: '15 min',
      urgente: false,
      icono: 'account-clock'
    },
    { 
      id: 3, 
      tipo: 'retraso', 
      mensaje: 'Orden #124 con retraso de 10 min',
      tiempo: '8 min',
      urgente: true,
      icono: 'clock-alert'
    },
    { 
      id: 4, 
      tipo: 'inventario', 
      mensaje: 'Stock bajo: Shampoo Loreal',
      tiempo: '1h',
      urgente: false,
      icono: 'package-variant'
    }
  ];

  // Función para manejar acciones rápidas
  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    
    switch (action) {
      case 'express':
        Alert.alert('Orden Express', '¿Crear orden rápida para cliente frecuente?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Crear', onPress: () => navigation.navigate('SelectCliente') }
        ]);
        break;
      case 'qr-scanner':
        setShowQROptions(true);
        break;
      case 'frequent-clients':
        // Navegar a lista de clientes frecuentes
        navigation.navigate('SelectCliente');
        break;
      case 'inventory':
        Alert.alert('Inventario Bajo', `${estadisticas.inventarioBajo} productos requieren reposición`, [
          { text: 'Ver detalles', onPress: () => console.log('Mostrar inventario bajo') },
          { text: 'Cerrar', style: 'cancel' }
        ]);
        break;
      case 'daily-cash':
        Alert.alert('Resumen del Día', 
          `Caja: $${estadisticas.cajaDelDia}\nVentas: $${estadisticas.ventasHoy}\nÓrdenes: ${estadisticas.ordenesHoy}`,
          [{ text: 'Cerrar', style: 'cancel' }]
        );
        break;
    }
  };

  // Función para manejar opciones QR
  const handleQRAction = (action: string) => {
    setShowQROptions(false);
    
    switch (action) {
      case 'scan':
        Alert.alert('Escáner QR', 'Función de escáner QR habilitada', [
          { text: 'Cerrar', style: 'cancel' }
        ]);
        break;
      case 'generate-receipt':
        Alert.alert('Generar QR', '¿Generar QR para la última orden?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Generar', onPress: () => console.log('Generar QR recibo') }
        ]);
        break;
      case 'scan-history':
        Alert.alert('Historial de Escaneados', 'Ver últimos QR escaneados', [
          { text: 'Cerrar', style: 'cancel' }
        ]);
        break;
      case 'promotional':
        Alert.alert('QR Promocional', 'Generar QR para promociones especiales', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Generar', onPress: () => console.log('Generar QR promocional') }
        ]);
        break;
    }
  };

  // Solo mostrar opciones si el usuario es operador
  if (state.user?.role === 'operator') {
    return (
      <View style={styles.container}>
        {/* Header con botón de back y notificaciones */}
        <View style={styles.header}>
          {navigation.canGoBack() && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Panel Operador</Text>
          <TouchableOpacity 
            style={styles.notificationBtn} 
            onPress={() => setShowNotifications(true)}
          >
            <MaterialCommunityIcons name="bell" size={24} color="#374151" />
            {notificaciones.filter(n => n.urgente).length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificaciones.filter(n => n.urgente).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          {/* Estadísticas Rápidas */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Resumen del Día</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{estadisticas.ordenesHoy}</Text>
                <Text style={styles.statLabel}>Órdenes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{estadisticas.ordenesEnProceso}</Text>
                <Text style={styles.statLabel}>En Proceso</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>${estadisticas.ventasHoy}</Text>
                <Text style={styles.statLabel}>Ventas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>${estadisticas.cajaDelDia}</Text>
                <Text style={styles.statLabel}>Caja</Text>
              </View>
            </View>
          </View>

          {/* Acciones Rápidas */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
              <TouchableOpacity onPress={() => setShowQuickActions(true)}>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard} onPress={() => handleQuickAction('express')}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="lightning-bolt" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.quickActionText}>Express</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={() => handleQuickAction('qr-scanner')}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#E0E7FF' }]}>
                  <MaterialCommunityIcons name="qrcode-scan" size={20} color="#6366F1" />
                </View>
                <Text style={styles.quickActionText}>Escanear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={() => handleQuickAction('frequent-clients')}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="account-star" size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.quickActionText}>Frecuentes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={() => handleQuickAction('inventory')}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]}>
                  <MaterialCommunityIcons name="package-variant" size={20} color="#EF4444" />
                </View>
                <Text style={styles.quickActionText}>Inventario</Text>
                {estadisticas.inventarioBajo > 0 && (
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>{estadisticas.inventarioBajo}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Panel Principal de Gestión */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Gestión Principal</Text>
            <View style={styles.compactGrid}>
              <TouchableOpacity style={styles.compactCard} onPress={() => navigation.navigate('SelectCliente')}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="plus-circle" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.compactCardTitle}>Crear Orden</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.compactCard} onPress={() => navigation.navigate('MisOrdenes')}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="clipboard-list" size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.compactCardTitle}>Mis Órdenes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.compactCard} onPress={() => navigation.navigate('Turnos')}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="calendar-today" size={20} color="#059669" />
                </View>
                <Text style={styles.compactCardTitle}>Mis Turnos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.compactCard} onPress={() => navigation.navigate('Turno')}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="clock-check" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.compactCardTitle}>Control Turno</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.compactCard} onPress={() => setShowQROptions(true)}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#E0E7FF' }]}>
                  <MaterialCommunityIcons name="qrcode" size={20} color="#6366F1" />
                </View>
                <Text style={styles.compactCardTitle}>Funciones QR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.compactCard} onPress={() => { logout(); navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }); }}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#FEF2F2' }]}>
                  <MaterialCommunityIcons name="logout-variant" size={20} color="#DC2626" />
                </View>
                <Text style={styles.compactCardTitle}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Modal de Notificaciones */}
        <Modal
          visible={showNotifications}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNotifications(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notificaciones</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                {notificaciones.map((notif) => (
                  <TouchableOpacity key={notif.id} style={[
                    styles.notificationItem,
                    notif.urgente && styles.notificationUrgent
                  ]}>
                    <View style={styles.notificationIcon}>
                      <MaterialCommunityIcons 
                        name={notif.icono as any} 
                        size={20} 
                        color={notif.urgente ? "#EF4444" : "#6B7280"} 
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={[styles.notificationText, notif.urgente && styles.notificationTextUrgent]}>
                        {notif.mensaje}
                      </Text>
                      <Text style={styles.notificationTime}>hace {notif.tiempo}</Text>
                    </View>
                    {notif.urgente && (
                      <View style={styles.urgentIndicator}>
                        <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de Acciones Rápidas */}
        <Modal
          visible={showQuickActions}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowQuickActions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Acciones Rápidas</Text>
                <TouchableOpacity onPress={() => setShowQuickActions(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQuickAction('express')}>
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color="#F59E0B" />
                  <Text style={styles.actionButtonText}>Orden Express</Text>
                  <Text style={styles.actionButtonSubtext}>Cliente frecuente</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQuickAction('daily-cash')}>
                  <MaterialCommunityIcons name="cash-register" size={24} color="#059669" />
                  <Text style={styles.actionButtonText}>Resumen de Caja</Text>
                  <Text style={styles.actionButtonSubtext}>Ventas del día</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQuickAction('inventory')}>
                  <MaterialCommunityIcons name="package-variant" size={24} color="#EF4444" />
                  <Text style={styles.actionButtonText}>Inventario Bajo</Text>
                  <Text style={styles.actionButtonSubtext}>{estadisticas.inventarioBajo} productos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Funciones QR */}
        <Modal
          visible={showQROptions}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowQROptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Funciones QR</Text>
                <TouchableOpacity onPress={() => setShowQROptions(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQRAction('scan')}>
                  <MaterialCommunityIcons name="qrcode-scan" size={24} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Escáner QR</Text>
                  <Text style={styles.actionButtonSubtext}>Escanear códigos QR</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQRAction('generate-receipt')}>
                  <MaterialCommunityIcons name="qrcode-plus" size={24} color="#059669" />
                  <Text style={styles.actionButtonText}>Generar QR Recibo</Text>
                  <Text style={styles.actionButtonSubtext}>Para órdenes completadas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQRAction('scan-history')}>
                  <MaterialCommunityIcons name="history" size={24} color="#8B5CF6" />
                  <Text style={styles.actionButtonText}>Historial de Escaneos</Text>
                  <Text style={styles.actionButtonSubtext}>Últimos códigos leídos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQRAction('promotional')}>
                  <MaterialCommunityIcons name="tag-multiple" size={24} color="#F59E0B" />
                  <Text style={styles.actionButtonText}>QR Promocional</Text>
                  <Text style={styles.actionButtonSubtext}>Ofertas especiales</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  // ...existing dashboard para otros roles...
  return (
    <View style={globalStyles.containerPadded}>
      <Text style={globalStyles.heading1}>Dashboard</Text>
      <Text style={globalStyles.bodyText}>Panel principal de la aplicación</Text>
      <TouchableOpacity style={globalStyles.button} onPress={() => { logout(); navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }); }}>
        <Text style={globalStyles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
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
  notificationBtn: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
  },
  statsContainer: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  quickActionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
  },
  quickActionIcon: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  alertBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
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
    minHeight: 300,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationUrgent: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  notificationIcon: {
    marginRight: 12,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationTextUrgent: {
    color: '#991B1B',
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  urgentIndicator: {
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 12,
    marginTop: 2,
  },
  // Estilos para tarjetas compactas
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    minHeight: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  compactIconContainer: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
});
