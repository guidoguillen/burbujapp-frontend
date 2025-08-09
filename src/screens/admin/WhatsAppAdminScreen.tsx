import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { whatsappApiService, WhatsAppStatus, WhatsAppMetrics } from '../../services/WhatsAppApiService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'WhatsAppAdmin'>;

export const WhatsAppAdminScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [metrics, setMetrics] = useState<WhatsAppMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [statusResponse, metricsResponse] = await Promise.all([
        whatsappApiService.obtenerEstado(),
        whatsappApiService.obtenerMetricas()
      ]);

      if (statusResponse.success) {
        setStatus(statusResponse.data);
      }

      if (metricsResponse.success) {
        setMetrics(metricsResponse.data);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos de WhatsApp');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const actualizarDatos = async () => {
    setRefreshing(true);
    await cargarDatos();
  };

  const navegarA = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any);
  };

  const obtenerColorEstado = (conectado: boolean) => {
    return conectado ? '#4CAF50' : '#F44336';
  };

  const obtenerIconoEstado = (conectado: boolean) => {
    return conectado ? 'check-circle' : 'close-circle';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Cargando datos de WhatsApp...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="whatsapp" size={32} color="#25D366" />
            <Text style={styles.headerTitle}>WhatsApp Business</Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={actualizarDatos}
            disabled={refreshing}
          >
            <MaterialCommunityIcons 
              name="refresh" 
              size={24} 
              color={refreshing ? "#ccc" : "#666"} 
            />
          </TouchableOpacity>
        </View>

        {/* Estado de Conexión */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado de Conexión</Text>
          {status ? (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <MaterialCommunityIcons 
                  name={obtenerIconoEstado(status.isConnected)} 
                  size={24} 
                  color={obtenerColorEstado(status.isConnected)} 
                />
                <View style={styles.statusInfo}>
                  <Text style={styles.statusTitle}>
                    {status.isConnected ? 'Conectado' : 'Desconectado'}
                  </Text>
                  <Text style={styles.statusSubtitle}>
                    {status.phoneNumber || 'No configurado'}
                  </Text>
                </View>
                {status.isConnected && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>ACTIVO</Text>
                  </View>
                )}
              </View>

              {status.isConnected && (
                <>
                  <View style={styles.businessInfo}>
                    <Text style={styles.businessName}>{status.businessName}</Text>
                    <Text style={styles.lastSync}>
                      Última sincronización: {new Date(status.lastSync).toLocaleString('es-BO')}
                    </Text>
                  </View>

                  <View style={styles.limitsContainer}>
                    <View style={styles.limitItem}>
                      <Text style={styles.limitLabel}>Mensajes hoy</Text>
                      <Text style={styles.limitValue}>
                        {status.apiLimits.messagesUsed} / {status.apiLimits.messagesPerDay}
                      </Text>
                    </View>
                    <View style={styles.limitProgress}>
                      <View 
                        style={[
                          styles.limitProgressBar, 
                          { 
                            width: `${(status.apiLimits.messagesUsed / status.apiLimits.messagesPerDay) * 100}%`,
                            backgroundColor: status.apiLimits.messagesUsed / status.apiLimits.messagesPerDay > 0.8 ? '#FF5722' : '#4CAF50'
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View style={styles.noConnectionContainer}>
              <MaterialCommunityIcons name="wifi-off" size={48} color="#ccc" />
              <Text style={styles.noConnectionText}>WhatsApp Business no configurado</Text>
              <TouchableOpacity 
                style={styles.configureButton}
                onPress={() => navegarA('WhatsAppConfig')}
              >
                <Text style={styles.configureButtonText}>Configurar Ahora</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Métricas Rápidas */}
        {metrics && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Métricas de Hoy</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="message-outline" size={24} color="#2196F3" />
                <Text style={styles.metricValue}>{metrics.overview.totalMessages}</Text>
                <Text style={styles.metricLabel}>Mensajes Total</Text>
              </View>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="send-outline" size={24} color="#4CAF50" />
                <Text style={styles.metricValue}>{metrics.overview.messagesSent}</Text>
                <Text style={styles.metricLabel}>Enviados</Text>
              </View>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="reply-outline" size={24} color="#FF9800" />
                <Text style={styles.metricValue}>{metrics.overview.messagesReceived}</Text>
                <Text style={styles.metricLabel}>Recibidos</Text>
              </View>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="account-group-outline" size={24} color="#9C27B0" />
                <Text style={styles.metricValue}>{metrics.overview.activeConversations}</Text>
                <Text style={styles.metricLabel}>Conversaciones</Text>
              </View>
            </View>

            <View style={styles.performanceMetrics}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Tasa de Entrega</Text>
                <Text style={[styles.performanceValue, { color: '#4CAF50' }]}>
                  {metrics.overview.deliveryRate.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Tasa de Lectura</Text>
                <Text style={[styles.performanceValue, { color: '#2196F3' }]}>
                  {metrics.overview.readRate.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Tasa de Respuesta</Text>
                <Text style={[styles.performanceValue, { color: '#FF9800' }]}>
                  {metrics.overview.responseRate.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Funciones Principales */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gestión WhatsApp Business</Text>
          <View style={styles.functionsGrid}>
            <TouchableOpacity 
              style={styles.functionCard}
              onPress={() => navegarA('WhatsAppTemplates')}
            >
              <MaterialCommunityIcons name="file-document-outline" size={32} color="#4CAF50" />
              <Text style={styles.functionTitle}>Plantillas</Text>
              <Text style={styles.functionSubtitle}>Gestionar mensajes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.functionCard}
              onPress={() => navegarA('WhatsAppContacts')}
            >
              <MaterialCommunityIcons name="contacts-outline" size={32} color="#2196F3" />
              <Text style={styles.functionTitle}>Contactos</Text>
              <Text style={styles.functionSubtitle}>Base de datos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.functionCard}
              onPress={() => navegarA('WhatsAppCampaigns')}
            >
              <MaterialCommunityIcons name="bullhorn-outline" size={32} color="#FF9800" />
              <Text style={styles.functionTitle}>Campañas</Text>
              <Text style={styles.functionSubtitle}>Mensajería masiva</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.functionCard}
              onPress={() => navegarA('WhatsAppAutomation')}
            >
              <MaterialCommunityIcons name="robot-outline" size={32} color="#9C27B0" />
              <Text style={styles.functionTitle}>Automatización</Text>
              <Text style={styles.functionSubtitle}>Chatbots y flujos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.functionCard}
              onPress={() => navegarA('WhatsAppAnalytics')}
            >
              <MaterialCommunityIcons name="chart-line" size={32} color="#F44336" />
              <Text style={styles.functionTitle}>Análíticas</Text>
              <Text style={styles.functionSubtitle}>Reportes y métricas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.functionCard}
              onPress={() => navegarA('WhatsAppConfig')}
            >
              <MaterialCommunityIcons name="cog-outline" size={32} color="#607D8B" />
              <Text style={styles.functionTitle}>Configuración</Text>
              <Text style={styles.functionSubtitle}>API y webhook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navegarA('WhatsAppTemplates')}
            >
              <MaterialCommunityIcons name="plus" size={20} color="white" />
              <Text style={styles.quickActionText}>Nueva Plantilla</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#2196F3' }]}
              onPress={() => navegarA('WhatsAppCampaigns')}
            >
              <MaterialCommunityIcons name="send" size={20} color="white" />
              <Text style={styles.quickActionText}>Enviar Campaña</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: '#FF9800' }]}
              onPress={() => navegarA('WhatsAppContacts')}
            >
              <MaterialCommunityIcons name="upload" size={20} color="white" />
              <Text style={styles.quickActionText}>Importar Contactos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statusContainer: {
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  businessInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lastSync: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  limitsContainer: {
    marginTop: 16,
  },
  limitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitLabel: {
    fontSize: 14,
    color: '#666',
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  limitProgress: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  limitProgressBar: {
    height: 6,
    borderRadius: 3,
  },
  noConnectionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noConnectionText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  configureButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  configureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  functionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  functionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  functionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  functionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
