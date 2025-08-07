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

  // Panel de Administración
  if (state.user?.role === 'admin') {
    return (
      <View style={styles.container}>
        {/* Header para Admin */}
        <View style={styles.header}>
          {navigation.canGoBack() && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Panel Administrador</Text>
          <TouchableOpacity 
            style={styles.notificationBtn} 
            onPress={() => setShowNotifications(true)}
          >
            <MaterialCommunityIcons name="shield-crown" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          {/* Dashboard Ejecutivo */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>📊 Dashboard Ejecutivo</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>$2,450</Text>
                <Text style={styles.statLabel}>Ventas Hoy</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Órdenes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Clientes Nuevos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>92%</Text>
                <Text style={styles.statLabel}>Satisfacción</Text>
              </View>
            </View>
          </View>

          {/* Gestión de Usuarios */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>👥 Gestión de Usuarios</Text>
            <View style={styles.adminGrid}>
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Operadores', 'Gestionar cuentas de operadores')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="account-group" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.adminCardTitle}>Operadores</Text>
                <Text style={styles.adminCardSubtitle}>3 activos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Permisos', 'Configurar roles y permisos')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="shield-account" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Permisos</Text>
                <Text style={styles.adminCardSubtitle}>Roles y accesos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Actividad', 'Historial de usuarios')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="history" size={24} color="#059669" />
                </View>
                <Text style={styles.adminCardTitle}>Actividad</Text>
                <Text style={styles.adminCardSubtitle}>Logs del sistema</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Horarios', 'Gestión de turnos')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="clock-time-eight" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.adminCardTitle}>Horarios</Text>
                <Text style={styles.adminCardSubtitle}>Turnos laborales</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Control Financiero */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>💰 Control Financiero</Text>
            <View style={styles.adminGrid}>
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Caja', `Ingresos del día: $2,450\nEfectivo: $1,800\nTarjeta: $650`)}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#ECFDF5' }]}>
                  <MaterialCommunityIcons name="cash-register" size={24} color="#10B981" />
                </View>
                <Text style={styles.adminCardTitle}>Caja</Text>
                <Text style={styles.adminCardSubtitle}>$2,450 hoy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Reportes', 'Generar reportes financieros')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="chart-line" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.adminCardTitle}>Reportes</Text>
                <Text style={styles.adminCardSubtitle}>Análisis financiero</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Gastos', 'Control de gastos operativos')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <MaterialCommunityIcons name="receipt" size={24} color="#EF4444" />
                </View>
                <Text style={styles.adminCardTitle}>Gastos</Text>
                <Text style={styles.adminCardSubtitle}>$320 hoy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Comisiones', 'Cálculo de comisiones por operador')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="percent" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Comisiones</Text>
                <Text style={styles.adminCardSubtitle}>Por operador</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reportes y Analytics */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📈 Reportes y Analytics</Text>
            <View style={styles.adminGrid}>
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Ventas', 'Análisis detallado de ventas')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="trending-up" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.adminCardTitle}>Ventas</Text>
                <Text style={styles.adminCardSubtitle}>Tendencias</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Clientes', 'Análisis de comportamiento de clientes')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="account-star" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Clientes</Text>
                <Text style={styles.adminCardSubtitle}>Frecuentes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Exportar', 'Exportar datos para contabilidad')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="file-excel" size={24} color="#059669" />
                </View>
                <Text style={styles.adminCardTitle}>Exportar</Text>
                <Text style={styles.adminCardSubtitle}>Excel/PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Servicios', 'Análisis de rentabilidad por servicio')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="washing-machine" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.adminCardTitle}>Servicios</Text>
                <Text style={styles.adminCardSubtitle}>Rentabilidad</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Configuración del Sistema */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>⚙️ Configuración del Sistema</Text>
            <View style={styles.adminGrid}>
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Precios', 'Actualizar tarifas de servicios')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="currency-usd" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.adminCardTitle}>Precios</Text>
                <Text style={styles.adminCardSubtitle}>Tarifas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => setShowQROptions(true)}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#E0E7FF' }]}>
                  <MaterialCommunityIcons name="qrcode-plus" size={24} color="#6366F1" />
                </View>
                <Text style={styles.adminCardTitle}>Config QR</Text>
                <Text style={styles.adminCardSubtitle}>Personalizar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Notificaciones', 'Configurar alertas automáticas')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="bell-cog" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Alertas</Text>
                <Text style={styles.adminCardSubtitle}>Push/SMS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Backup', 'Respaldo de datos del sistema')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="database-export" size={24} color="#059669" />
                </View>
                <Text style={styles.adminCardTitle}>Backup</Text>
                <Text style={styles.adminCardSubtitle}>Datos</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Funciones Avanzadas */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📱 Funciones Avanzadas</Text>
            <View style={styles.adminGrid}>
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Promociones', 'Crear ofertas especiales')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="tag-multiple" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.adminCardTitle}>Promociones</Text>
                <Text style={styles.adminCardSubtitle}>Ofertas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Fidelidad', 'Programa de puntos y descuentos')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="star-circle" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Fidelidad</Text>
                <Text style={styles.adminCardSubtitle}>Puntos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('WhatsApp', 'Integración de notificaciones automáticas')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#ECFDF5' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#10B981" />
                </View>
                <Text style={styles.adminCardTitle}>WhatsApp</Text>
                <Text style={styles.adminCardSubtitle}>Automático</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => Alert.alert('Calendario', 'Gestión de citas y reservas')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="calendar-month" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.adminCardTitle}>Calendario</Text>
                <Text style={styles.adminCardSubtitle}>Citas</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Acceso Rápido a Gestión */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🚀 Acceso Rápido</Text>
            <View style={styles.compactGrid}>
              <TouchableOpacity style={styles.compactCard} onPress={() => navigation.navigate('MisOrdenes')}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="clipboard-list" size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.compactCardTitle}>Todas las Órdenes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.compactCard} onPress={() => navigation.navigate('SelectCliente')}>
                <View style={[styles.compactIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="plus-circle" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.compactCardTitle}>Nueva Orden</Text>
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

        {/* Modales reutilizados del operador */}
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
                <Text style={styles.modalTitle}>📊 Alertas Administrativas</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                <TouchableOpacity style={[styles.notificationItem, styles.notificationUrgent]}>
                  <View style={styles.notificationIcon}>
                    <MaterialCommunityIcons name="alert-circle" size={20} color="#EF4444" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={[styles.notificationText, styles.notificationTextUrgent]}>
                      Meta de ventas mensual al 85%
                    </Text>
                    <Text style={styles.notificationTime}>hace 2h</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <MaterialCommunityIcons name="cash-register" size={20} color="#10B981" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationText}>
                      Ingresos del día: $2,450 (+12%)
                    </Text>
                    <Text style={styles.notificationTime}>hace 30min</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <MaterialCommunityIcons name="account-plus" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationText}>
                      8 nuevos clientes registrados hoy
                    </Text>
                    <Text style={styles.notificationTime}>hace 1h</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de Opciones QR (reutilizado) */}
        <Modal
          visible={showQROptions}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowQROptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>⚙️ Configuración QR</Text>
                <TouchableOpacity onPress={() => setShowQROptions(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Personalizar', 'Configurar diseño de códigos QR')}>
                  <MaterialCommunityIcons name="palette" size={24} color="#8B5CF6" />
                  <Text style={styles.actionButtonText}>Personalizar Diseño</Text>
                  <Text style={styles.actionButtonSubtext}>Colores y logos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Enlaces', 'Configurar URLs de destino')}>
                  <MaterialCommunityIcons name="link-variant" size={24} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>Enlaces de Destino</Text>
                  <Text style={styles.actionButtonSubtext}>URLs personalizadas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Análisis', 'Estadísticas de escaneos')}>
                  <MaterialCommunityIcons name="chart-bar" size={24} color="#10B981" />
                  <Text style={styles.actionButtonText}>Análisis de Uso</Text>
                  <Text style={styles.actionButtonSubtext}>Estadísticas de escaneo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Dashboard para otros roles...
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
  // Estilos para panel de administrador
  adminGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  adminIconContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  adminCardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});
