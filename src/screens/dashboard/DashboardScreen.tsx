import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { globalStyles } from '../../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout, state } = useAuth();
  
  // Estados para modales
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQROptions, setShowQROptions] = useState(false);

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
      <View style={styles.containerLight}>
        {/* Header estilo light moderno */}
        <View style={styles.headerLight}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitleLight}>Panel de Operador</Text>
          <TouchableOpacity 
            style={styles.settingsBtnLight} 
            onPress={() => setShowNotifications(true)}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#696969" />
            {notificaciones.filter(n => n.urgente).length > 0 && (
              <View style={styles.notificationBadgeLight}>
                <Text style={styles.notificationBadgeTextLight}>
                  {notificaciones.filter(n => n.urgente).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.mainLight} showsVerticalScrollIndicator={false}>
          {/* Resumen del día - estilo light */}
          <View style={styles.sectionHeaderLight}>
            <Text style={styles.sectionTitleLight}>Resumen del Día</Text>
          </View>
          
          <View style={styles.statsListLight}>
            <TouchableOpacity style={styles.statCardLight}>
              <View style={styles.statIconContainerPrimary}>
                <MaterialCommunityIcons name="clipboard-check" size={28} color="#1E90FF" />
              </View>
              <View style={styles.statContentLight}>
                <Text style={styles.statLabelLight}>Órdenes completadas</Text>
                <Text style={styles.statNumberLight}>{estadisticas.ordenesHoy}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCardLight}>
              <View style={styles.statIconContainerAccent}>
                <MaterialCommunityIcons name="currency-usd" size={28} color="#32CD32" />
              </View>
              <View style={styles.statContentLight}>
                <Text style={styles.statLabelLight}>Ingresos totales</Text>
                <Text style={styles.statNumberLight}>${estadisticas.ventasHoy}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          {/* Acciones rápidas - estilo light */}
          <View style={styles.sectionHeaderLight}>
            <Text style={styles.sectionTitleLight}>Acciones Rápidas</Text>
          </View>
          
          <View style={styles.actionListLight}>
            <TouchableOpacity style={styles.actionCardLight} onPress={() => navigation.navigate('SelectCliente')}>
              <View style={styles.actionIconContainerLight}>
                <MaterialCommunityIcons name="plus-box" size={28} color="#1E90FF" />
              </View>
              <View style={styles.actionContentLight}>
                <Text style={styles.actionTitleLight}>Crear Orden</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCardLight} onPress={() => navigation.navigate('MisOrdenes')}>
              <View style={styles.actionIconContainerLight}>
                <MaterialCommunityIcons name="receipt" size={28} color="#1E90FF" />
              </View>
              <View style={styles.actionContentLight}>
                <Text style={styles.actionTitleLight}>Mis Órdenes</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCardLight} onPress={() => navigation.navigate('Turno')}>
              <View style={styles.actionIconContainerLight}>
                <MaterialCommunityIcons name="clock-check" size={28} color="#1E90FF" />
              </View>
              <View style={styles.actionContentLight}>
                <Text style={styles.actionTitleLight}>Control de Turno</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCardLight} onPress={() => setShowQROptions(true)}>
              <View style={styles.actionIconContainerLight}>
                <MaterialCommunityIcons name="qrcode" size={28} color="#1E90FF" />
              </View>
              <View style={styles.actionContentLight}>
                <Text style={styles.actionTitleLight}>Funciones QR</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavLight}>
          <TouchableOpacity style={styles.navItemActiveLight}>
            <MaterialCommunityIcons name="home" size={24} color="#1E90FF" />
            <Text style={styles.navLabelActiveLight}>Inicio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItemLight} onPress={() => navigation.navigate('MisOrdenes')}>
            <MaterialCommunityIcons name="receipt" size={24} color="#696969" />
            <Text style={styles.navLabelLight}>Órdenes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItemLight} onPress={() => navigation.navigate('Turno')}>
            <MaterialCommunityIcons name="currency-usd" size={24} color="#696969" />
            <Text style={styles.navLabelLight}>Ingresos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItemLight} onPress={() => navigation.navigate('ConfiguracionSistema')}>
            <MaterialCommunityIcons name="account" size={24} color="#696969" />
            <Text style={styles.navLabelLight}>Perfil</Text>
          </TouchableOpacity>
        </View>

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
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('GestionUsuarios')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="account-group" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.adminCardTitle}>Operadores</Text>
                <Text style={styles.adminCardSubtitle}>3 activos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('GestionPermisos')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="shield-account" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Permisos</Text>
                <Text style={styles.adminCardSubtitle}>Roles y accesos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ActividadLogs')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="history" size={24} color="#059669" />
                </View>
                <Text style={styles.adminCardTitle}>Actividad</Text>
                <Text style={styles.adminCardSubtitle}>Logs del sistema</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('GestionHorarios')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="clock-time-eight" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.adminCardTitle}>Horarios</Text>
                <Text style={styles.adminCardSubtitle}>Turnos laborales</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* WhatsApp Business */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📱 WhatsApp Business</Text>
            <View style={styles.adminGrid}>
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('WhatsAppAdmin')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#DCFCE7' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
                </View>
                <Text style={styles.adminCardTitle}>Panel Principal</Text>
                <Text style={styles.adminCardSubtitle}>Dashboard y estado</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('WhatsAppTemplates')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color="#2563EB" />
                </View>
                <Text style={styles.adminCardTitle}>Plantillas</Text>
                <Text style={styles.adminCardSubtitle}>Mensajes aprobados</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('WhatsAppCampaigns')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEF3E2' }]}>
                  <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#EA580C" />
                </View>
                <Text style={styles.adminCardTitle}>Campañas</Text>
                <Text style={styles.adminCardSubtitle}>Mensajería masiva</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('WhatsAppAnalytics')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="chart-line" size={24} color="#9333EA" />
                </View>
                <Text style={styles.adminCardTitle}>Análíticas</Text>
                <Text style={styles.adminCardSubtitle}>Métricas y reportes</Text>
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
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ReportesAnalytics')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#EBF8FF' }]}>
                  <MaterialCommunityIcons name="trending-up" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.adminCardTitle}>Ventas</Text>
                <Text style={styles.adminCardSubtitle}>Tendencias</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ReportesAnalytics')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="account-star" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Clientes</Text>
                <Text style={styles.adminCardSubtitle}>Frecuentes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ReportesAnalytics')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="file-excel" size={24} color="#059669" />
                </View>
                <Text style={styles.adminCardTitle}>Exportar</Text>
                <Text style={styles.adminCardSubtitle}>Excel/PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ReportesAnalytics')}>
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
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ConfiguracionSistema')}>
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
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ConfiguracionSistema')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="bell" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Alertas</Text>
                <Text style={styles.adminCardSubtitle}>Push/SMS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('ConfiguracionSistema')}>
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
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('FuncionesAvanzadas')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="tag-multiple" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.adminCardTitle}>Promociones</Text>
                <Text style={styles.adminCardSubtitle}>Ofertas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('FuncionesAvanzadas')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="star-circle" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.adminCardTitle}>Fidelidad</Text>
                <Text style={styles.adminCardSubtitle}>Puntos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('FuncionesAvanzadas')}>
                <View style={[styles.adminIconContainer, { backgroundColor: '#ECFDF5' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#10B981" />
                </View>
                <Text style={styles.adminCardTitle}>WhatsApp</Text>
                <Text style={styles.adminCardSubtitle}>Automático</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.adminCard} onPress={() => navigation.navigate('FuncionesAvanzadas')}>
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
    backgroundColor: '#111a22',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSpacer: {
    width: 24,
  },
  backBtn: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  notificationBtn: {
    position: 'relative',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  // Estilos Dark Theme
  headerDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#111a22',
  },
  headerTitleDark: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.015,
  },
  settingsBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadgeDark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1173d4',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainDark: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeaderDark: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitleDark: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.015,
  },
  statsGridDark: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statCardDark: {
    flex: 1,
    backgroundColor: '#192633',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#233648',
    padding: 16,
    gap: 8,
  },
  statLabelDark: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  statNumberDark: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  actionGridDark: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCardDark: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#192633',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#233648',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionCardTitleDark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    minHeight: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  modalContent: {
    padding: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  notificationUrgent: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  notificationIcon: {
    marginRight: 16,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  notificationTextUrgent: {
    color: '#991B1B',
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  urgentIndicator: {
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 16,
    flex: 1,
    letterSpacing: 0.2,
  },
  actionButtonSubtext: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 16,
    marginTop: 3,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  // Estilos para tarjetas compactas
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  compactCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    minHeight: 95,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 1 }],
  },
  compactIconContainer: {
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  // Nuevos estilos para tarjetas con gradiente
  compactCardGradient: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    minHeight: 105,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 4,
  },
  compactIconContainerWhite: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  compactCardTitleWhite: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Estilos para panel de administrador
  adminGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  adminCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  adminIconContainer: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  adminCardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  // Estilos Light Theme
  containerLight: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  headerTitleLight: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F4F4F',
    textAlign: 'center',
    letterSpacing: -0.015,
  },
  settingsBtnLight: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadgeLight: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeTextLight: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mainLight: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeaderLight: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitleLight: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F4F4F',
    letterSpacing: -0.015,
  },
  statsListLight: {
    gap: 16,
    marginBottom: 20,
  },
  statCardLight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.8)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainerPrimary: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainerAccent: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(50, 205, 50, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContentLight: {
    flex: 1,
  },
  statLabelLight: {
    fontSize: 16,
    fontWeight: '500',
    color: '#696969',
    marginBottom: 4,
  },
  statNumberLight: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F4F4F',
    lineHeight: 32,
  },
  actionListLight: {
    gap: 16,
    paddingBottom: 20,
  },
  actionCardLight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.8)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainerLight: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContentLight: {
    flex: 1,
  },
  actionTitleLight: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F4F4F',
    lineHeight: 22,
  },
  // Bottom Navigation Styles
  bottomNavLight: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.8)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  navItemActiveLight: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navItemLight: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabelActiveLight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E90FF',
    lineHeight: 14,
  },
  navLabelLight: {
    fontSize: 12,
    fontWeight: '500',
    color: '#696969',
    lineHeight: 14,
  },
});
