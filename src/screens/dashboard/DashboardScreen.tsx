import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { globalStyles } from '../../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout, state } = useAuth();

  // Estadísticas mock (en una app real vendrían de una API)
  const estadisticas = {
    ordenesHoy: 8,
    ordenesEnProceso: 3,
    ventasHoy: 280,
    clientesAtendidos: 6
  };

  // Solo mostrar opciones si el usuario es operador
  if (state.user?.role === 'operator') {
    return (
      <View style={styles.container}>
        {/* Header con botón de back */}
        <View style={styles.header}>
          {navigation.canGoBack() && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Panel Operador</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.main}>
          {/* Estadísticas rápidas */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>📊 Resumen del día</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{estadisticas.ordenesHoy}</Text>
                <Text style={styles.statLabel}>Órdenes hoy</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{estadisticas.ordenesEnProceso}</Text>
                <Text style={styles.statLabel}>En proceso</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>${estadisticas.ventasHoy}</Text>
                <Text style={styles.statLabel}>Ventas hoy</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{estadisticas.clientesAtendidos}</Text>
                <Text style={styles.statLabel}>Clientes</Text>
              </View>
            </View>
          </View>

          <View style={styles.grid}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectCliente')}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <MaterialCommunityIcons name="plus-box-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Crear Orden</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MisOrdenes')}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#EDE9FE' }]}>
                <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#7C3AED" />
              </View>
              <Text style={styles.cardTitle}>Mis Órdenes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Turnos')}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#F0FDFA' }]}>
                <MaterialCommunityIcons name="calendar-clock" size={24} color="#0D9488" />
              </View>
              <Text style={styles.cardTitle}>Mis Turnos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Turno')}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <MaterialCommunityIcons name="clock-check-outline" size={24} color="#059669" />
              </View>
              <Text style={styles.cardTitle}>Control Turno</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.card} onPress={() => { logout(); navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }); }}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#FEF2F2' }]}>
                <MaterialCommunityIcons name="logout" size={24} color="#DC2626" />
              </View>
              <Text style={styles.cardTitle}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  main: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIconContainer: {
    borderRadius: 50,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
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
});
