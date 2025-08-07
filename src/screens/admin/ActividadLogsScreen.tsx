import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ActividadLogs'>;

interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata?: any;
}

type LogFilter = 'all' | 'info' | 'warning' | 'error' | 'critical';
type LogModule = 'all' | 'auth' | 'orders' | 'users' | 'payments' | 'system';

export const ActividadLogsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchText, setSearchText] = useState('');
  const [severityFilter, setSeverityFilter] = useState<LogFilter>('all');
  const [moduleFilter, setModuleFilter] = useState<LogModule>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('today');

  // Mock data para los logs
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2025-08-07T10:30:00.000Z',
      userId: 'usr_001',
      userName: 'Juan Pérez',
      userRole: 'admin',
      action: 'LOGIN',
      module: 'auth',
      description: 'Usuario administrador inició sesión exitosamente',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'info'
    },
    {
      id: '2',
      timestamp: '2025-08-07T10:25:00.000Z',
      userId: 'usr_002',
      userName: 'María García',
      userRole: 'operator',
      action: 'CREATE_ORDER',
      module: 'orders',
      description: 'Nueva orden creada: #ORD123',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
      severity: 'info',
      metadata: { orderId: 'ORD123', total: 85.50 }
    },
    {
      id: '3',
      timestamp: '2025-08-07T10:20:00.000Z',
      userId: 'sys_001',
      userName: 'Sistema',
      userRole: 'system',
      action: 'BACKUP_COMPLETED',
      module: 'system',
      description: 'Respaldo automático completado exitosamente',
      ipAddress: 'localhost',
      userAgent: 'System Process',
      severity: 'info'
    },
    {
      id: '4',
      timestamp: '2025-08-07T10:15:00.000Z',
      userId: 'usr_003',
      userName: 'Carlos López',
      userRole: 'operator',
      action: 'PAYMENT_FAILED',
      module: 'payments',
      description: 'Intento de pago fallido - Tarjeta rechazada',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Android 11; Mobile)',
      severity: 'warning',
      metadata: { paymentId: 'PAY456', amount: 120.00, reason: 'insufficient_funds' }
    },
    {
      id: '5',
      timestamp: '2025-08-07T10:10:00.000Z',
      userId: 'usr_004',
      userName: 'Ana Martínez',
      userRole: 'admin',
      action: 'DELETE_USER',
      module: 'users',
      description: 'Usuario eliminado del sistema: test@example.com',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'warning',
      metadata: { deletedUserId: 'usr_999', deletedUserEmail: 'test@example.com' }
    },
    {
      id: '6',
      timestamp: '2025-08-07T10:05:00.000Z',
      userId: 'sys_001',
      userName: 'Sistema',
      userRole: 'system',
      action: 'DATABASE_ERROR',
      module: 'system',
      description: 'Error de conexión con la base de datos - Reconectando...',
      ipAddress: 'localhost',
      userAgent: 'System Process',
      severity: 'error',
      metadata: { error: 'Connection timeout', duration: '5.2s' }
    },
    {
      id: '7',
      timestamp: '2025-08-07T09:50:00.000Z',
      userId: 'usr_005',
      userName: 'Pedro Rodríguez',
      userRole: 'operator',
      action: 'UNAUTHORIZED_ACCESS',
      module: 'auth',
      description: 'Intento de acceso no autorizado a módulo de administración',
      ipAddress: '192.168.1.150',
      userAgent: 'Mozilla/5.0 (Linux; Android 10)',
      severity: 'critical',
      metadata: { attemptedModule: 'admin_panel', deniedReason: 'insufficient_permissions' }
    }
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchText, severityFilter, moduleFilter, dateRange]);

  const loadLogs = async () => {
    setIsRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setLogs(mockLogs);
      setIsRefreshing(false);
    }, 1000);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filtrar por fecha
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
    }

    // Filtrar por severidad
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    // Filtrar por módulo
    if (moduleFilter !== 'all') {
      filtered = filtered.filter(log => log.module === moduleFilter);
    }

    // Filtrar por texto de búsqueda
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(search) ||
        log.action.toLowerCase().includes(search) ||
        log.description.toLowerCase().includes(search) ||
        log.module.toLowerCase().includes(search)
      );
    }

    setFilteredLogs(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'information' as const };
      case 'warning':
        return { backgroundColor: '#FEF3C7', color: '#92400E', icon: 'alert' as const };
      case 'error':
        return { backgroundColor: '#FEE2E2', color: '#DC2626', icon: 'alert-circle' as const };
      case 'critical':
        return { backgroundColor: '#FDF2F8', color: '#BE185D', icon: 'alert-octagon' as const };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', icon: 'help-circle' as const };
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'auth': return 'shield-account';
      case 'orders': return 'package-variant';
      case 'users': return 'account-group';
      case 'payments': return 'credit-card';
      case 'system': return 'cog';
      default: return 'help-circle';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const exportLogs = () => {
    Alert.alert(
      '📊 Exportar Logs',
      `Se exportarán ${filteredLogs.length} registros de actividad`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => Alert.alert('✅ Éxito', 'Los logs se han exportado correctamente')
        }
      ]
    );
  };

  const clearOldLogs = () => {
    Alert.alert(
      '🗑️ Limpiar Logs Antiguos',
      '¿Estás seguro de que deseas eliminar los logs de más de 30 días?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => Alert.alert('✅ Éxito', 'Los logs antiguos han sido eliminados')
        }
      ]
    );
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => {
    const severityStyle = getSeverityColor(item.severity);
    
    return (
      <TouchableOpacity 
        style={styles.logCard}
        onPress={() => {
          setSelectedLog(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.logHeader}>
          <View style={styles.logTitleContainer}>
            <MaterialCommunityIcons 
              name={getModuleIcon(item.module)} 
              size={16} 
              color="#6B7280" 
            />
            <Text style={styles.logAction}>{item.action}</Text>
            <View style={[styles.severityBadge, { backgroundColor: severityStyle.backgroundColor }]}>
              <MaterialCommunityIcons 
                name={severityStyle.icon} 
                size={12} 
                color={severityStyle.color} 
              />
              <Text style={[styles.severityText, { color: severityStyle.color }]}>
                {item.severity.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.logTimeContainer}>
            <Text style={styles.logTime}>{formatTime(item.timestamp)}</Text>
            <Text style={styles.logDate}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>

        <Text style={styles.logDescription}>{item.description}</Text>
        
        <View style={styles.logFooter}>
          <Text style={styles.logUser}>
            👤 {item.userName} ({item.userRole})
          </Text>
          <Text style={styles.logModule}>
            📁 {item.module}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getFilterCounts = () => {
    const counts = {
      all: logs.length,
      info: logs.filter(l => l.severity === 'info').length,
      warning: logs.filter(l => l.severity === 'warning').length,
      error: logs.filter(l => l.severity === 'error').length,
      critical: logs.filter(l => l.severity === 'critical').length
    };
    return counts;
  };

  const filterCounts = getFilterCounts();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logs de Actividad</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={exportLogs}>
            <MaterialCommunityIcons name="download" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={loadLogs}>
            <MaterialCommunityIcons name="refresh" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros de Severidad */}
      <View style={styles.severityFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 'info', 'warning', 'error', 'critical'] as LogFilter[]).map((severity) => {
            const isActive = severityFilter === severity;
            const count = filterCounts[severity];
            const severityStyle = getSeverityColor(severity);
            
            return (
              <TouchableOpacity
                key={severity}
                style={[
                  styles.filterChip,
                  isActive && { backgroundColor: severityStyle.backgroundColor }
                ]}
                onPress={() => setSeverityFilter(severity)}
              >
                {severity !== 'all' && (
                  <MaterialCommunityIcons 
                    name={severityStyle.icon} 
                    size={14} 
                    color={isActive ? severityStyle.color : '#6B7280'} 
                  />
                )}
                <Text style={[
                  styles.filterChipText,
                  isActive && { color: severityStyle.color, fontWeight: '600' }
                ]}>
                  {severity === 'all' ? 'Todos' : severity.toUpperCase()} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Controles de Filtrado */}
      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por usuario, acción, descripción..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Filtro de Módulo */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Módulo:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['all', 'auth', 'orders', 'users', 'payments', 'system'] as LogModule[]).map((module) => (
                  <TouchableOpacity
                    key={module}
                    style={[
                      styles.filterButton,
                      moduleFilter === module && styles.filterButtonActive
                    ]}
                    onPress={() => setModuleFilter(module)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      moduleFilter === module && styles.filterButtonTextActive
                    ]}>
                      {module === 'all' ? 'Todos' : module}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Filtro de Fecha */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Período:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['today', 'week', 'month', 'all'] as const).map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.filterButton,
                      dateRange === period && styles.filterButtonActive
                    ]}
                    onPress={() => setDateRange(period)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      dateRange === period && styles.filterButtonTextActive
                    ]}>
                      {period === 'today' ? 'Hoy' : 
                       period === 'week' ? 'Semana' :
                       period === 'month' ? 'Mes' : 'Todo'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          📊 Mostrando {filteredLogs.length} de {logs.length} registros
        </Text>
        <TouchableOpacity style={styles.clearLogsBtn} onPress={clearOldLogs}>
          <MaterialCommunityIcons name="delete-sweep" size={16} color="#EF4444" />
          <Text style={styles.clearLogsBtnText}>Limpiar antiguos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Logs */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        renderItem={renderLogItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={loadLogs}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="history" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No hay logs disponibles</Text>
            <Text style={styles.emptySubtext}>
              {searchText || severityFilter !== 'all' || moduleFilter !== 'all' 
                ? 'Prueba ajustando los filtros'
                : 'Los registros de actividad aparecerán aquí'}
            </Text>
          </View>
        }
      />

      {/* Modal de Detalle */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del Log</Text>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {selectedLog && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID:</Text>
                  <Text style={styles.detailValue}>{selectedLog.id}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha y Hora:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedLog.timestamp)} {formatTime(selectedLog.timestamp)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Usuario:</Text>
                  <Text style={styles.detailValue}>
                    {selectedLog.userName} ({selectedLog.userRole})
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Acción:</Text>
                  <Text style={styles.detailValue}>{selectedLog.action}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Módulo:</Text>
                  <Text style={styles.detailValue}>{selectedLog.module}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Severidad:</Text>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(selectedLog.severity).backgroundColor }]}>
                    <Text style={[styles.severityText, { color: getSeverityColor(selectedLog.severity).color }]}>
                      {selectedLog.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Descripción:</Text>
                  <Text style={styles.detailValue}>{selectedLog.description}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>IP:</Text>
                  <Text style={styles.detailValue}>{selectedLog.ipAddress}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>User Agent:</Text>
                  <Text style={styles.detailValue}>{selectedLog.userAgent}</Text>
                </View>
                
                {selectedLog.metadata && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Metadata:</Text>
                    <Text style={styles.detailValue}>
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    padding: 8,
  },
  severityFilters: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    gap: 4,
  },
  filterChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  controls: {
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
  filterRow: {
    gap: 12,
  },
  filterGroup: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  filterButtonTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  statsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  clearLogsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  clearLogsBtnText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  logCard: {
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  logTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  logAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  logTimeContainer: {
    alignItems: 'flex-end',
  },
  logTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  logDate: {
    fontSize: 10,
    color: '#6B7280',
  },
  logDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logUser: {
    fontSize: 12,
    color: '#6B7280',
  },
  logModule: {
    fontSize: 12,
    color: '#6B7280',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
});
