import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Alert, Switch, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ConfiguracionGeneral {
  nombreNegocio: string;
  direccion: string;
  telefono: string;
  horarios: {
    apertura: string;
    cierre: string;
    diasLaborales: string[];
  };
  notificaciones: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    pushNotifications: boolean;
  };
  qrPersonalizacion: {
    incluirLogo: boolean;
    color: string;
    mensaje: string;
  };
}

interface TarifaServicio {
  id: string;
  servicio: string;
  precio: number;
  tiempo: number;
  categoria: string;
  activo: boolean;
}

interface SistemaConfiguracion {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  categoria: 'general' | 'servicios' | 'notificaciones' | 'seguridad' | 'sistema';
}

export const ConfiguracionSistemaScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [modalTarifas, setModalTarifas] = useState(false);
  const [modalNotificaciones, setModalNotificaciones] = useState(false);
  const [modalQR, setModalQR] = useState(false);
  const [modalRespaldo, setModalRespaldo] = useState(false);
  const [tarifaEditando, setTarifaEditando] = useState<TarifaServicio | null>(null);

  // Mock de configuración general
  const [configuracion, setConfiguracion] = useState<ConfiguracionGeneral>({
    nombreNegocio: 'Lavandería BurbujaApp',
    direccion: 'Av. Principal #123, Zona Centro',
    telefono: '77712345',
    horarios: {
      apertura: '08:00',
      cierre: '19:00',
      diasLaborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    notificaciones: {
      email: true,
      sms: true,
      whatsapp: true,
      pushNotifications: true
    },
    qrPersonalizacion: {
      incluirLogo: true,
      color: '#3B82F6',
      mensaje: 'Gracias por elegir BurbujaApp'
    }
  });

  // Mock de tarifas de servicios
  const [tarifas, setTarifas] = useState<TarifaServicio[]>([
    { id: '1', servicio: 'Lavado y Planchado', precio: 50, tiempo: 120, categoria: 'Básico', activo: true },
    { id: '2', servicio: 'Solo Lavado', precio: 30, tiempo: 60, categoria: 'Básico', activo: true },
    { id: '3', servicio: 'Solo Planchado', precio: 25, tiempo: 45, categoria: 'Básico', activo: true },
    { id: '4', servicio: 'Tintorería', precio: 120, tiempo: 180, categoria: 'Premium', activo: true },
    { id: '5', servicio: 'Lavado Express', precio: 60, tiempo: 90, categoria: 'Express', activo: true },
    { id: '6', servicio: 'Limpieza de Alfombras', precio: 150, tiempo: 240, categoria: 'Especializado', activo: true },
    { id: '7', servicio: 'Planchado Premium', precio: 80, tiempo: 90, categoria: 'Premium', activo: true }
  ]);

  // Mock de configuraciones del sistema
  const [configuracionesSistema] = useState<SistemaConfiguracion[]>([
    {
      id: '1',
      nombre: 'Información del Negocio',
      descripcion: 'Datos básicos y horarios de atención',
      icono: 'store',
      color: '#3B82F6',
      categoria: 'general'
    },
    {
      id: '2',
      nombre: 'Tarifas de Servicios',
      descripcion: 'Gestión de precios y tiempos',
      icono: 'currency-usd',
      color: '#10B981',
      categoria: 'servicios'
    },
    {
      id: '3',
      nombre: 'Configuración de QR',
      descripcion: 'Personalización de códigos QR',
      icono: 'qrcode',
      color: '#8B5CF6',
      categoria: 'servicios'
    },
    {
      id: '4',
      nombre: 'Notificaciones',
      descripcion: 'Canales de comunicación',
      icono: 'bell',
      color: '#F59E0B',
      categoria: 'notificaciones'
    },
    {
      id: '5',
      nombre: 'Respaldos y Seguridad',
      descripcion: 'Backup automático y seguridad',
      icono: 'shield-check',
      color: '#EF4444',
      categoria: 'seguridad'
    },
    {
      id: '6',
      nombre: 'Configuración de API',
      descripcion: 'Endpoints y microservicios',
      icono: 'api',
      color: '#6366F1',
      categoria: 'sistema'
    }
  ]);

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'general': return { backgroundColor: '#EBF8FF', color: '#3B82F6' };
      case 'servicios': return { backgroundColor: '#ECFDF5', color: '#10B981' };
      case 'notificaciones': return { backgroundColor: '#FEF3C7', color: '#F59E0B' };
      case 'seguridad': return { backgroundColor: '#FEF2F2', color: '#EF4444' };
      case 'sistema': return { backgroundColor: '#F3E8FF', color: '#8B5CF6' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const abrirConfiguracion = (config: SistemaConfiguracion) => {
    switch (config.id) {
      case '1':
        Alert.alert('Información del Negocio', 'Configurar datos básicos del negocio');
        break;
      case '2':
        setModalTarifas(true);
        break;
      case '3':
        setModalQR(true);
        break;
      case '4':
        setModalNotificaciones(true);
        break;
      case '5':
        setModalRespaldo(true);
        break;
      case '6':
        Alert.alert('API Configuration', 'Configurar endpoints de microservicios');
        break;
      default:
        Alert.alert('Configuración', `Abrir ${config.nombre}`);
    }
  };

  const editarTarifa = (tarifa: TarifaServicio) => {
    setTarifaEditando(tarifa);
  };

  const guardarTarifa = () => {
    if (tarifaEditando) {
      setTarifas(prev => prev.map(t => 
        t.id === tarifaEditando.id ? tarifaEditando : t
      ));
      setTarifaEditando(null);
      Alert.alert('✅ Éxito', 'Tarifa actualizada correctamente');
    }
  };

  const toggleNotificacion = (tipo: keyof typeof configuracion.notificaciones) => {
    setConfiguracion(prev => ({
      ...prev,
      notificaciones: {
        ...prev.notificaciones,
        [tipo]: !prev.notificaciones[tipo]
      }
    }));
  };

  const renderConfiguracion = ({ item }: { item: SistemaConfiguracion }) => {
    const categoriaStyle = getCategoriaColor(item.categoria);
    
    return (
      <TouchableOpacity 
        style={styles.configCard}
        onPress={() => abrirConfiguracion(item)}
      >
        <View style={styles.configHeader}>
          <View style={[styles.configIcon, { backgroundColor: categoriaStyle.backgroundColor }]}>
            <MaterialCommunityIcons name={item.icono as any} size={24} color={item.color} />
          </View>
          
          <View style={styles.configInfo}>
            <Text style={styles.configNombre}>{item.nombre}</Text>
            <Text style={styles.configDescripcion}>{item.descripcion}</Text>
          </View>
        </View>
        
        <View style={styles.configActions}>
          <View style={[styles.categoriaTag, categoriaStyle]}>
            <Text style={[styles.categoriaText, { color: categoriaStyle.color }]}>
              {item.categoria}
            </Text>
          </View>
          
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderTarifa = ({ item }: { item: TarifaServicio }) => {
    return (
      <View style={styles.tarifaCard}>
        <View style={styles.tarifaInfo}>
          <Text style={styles.tarifaNombre}>{item.servicio}</Text>
          <Text style={styles.tarifaCategoria}>{item.categoria}</Text>
          <Text style={styles.tarifaTiempo}>⏱️ {item.tiempo} min</Text>
        </View>
        
        <View style={styles.tarifaMeta}>
          <Text style={styles.tarifaPrecio}>${item.precio}</Text>
          <Switch
            value={item.activo}
            onValueChange={(value) => {
              setTarifas(prev => prev.map(t => 
                t.id === item.id ? { ...t, activo: value } : t
              ));
            }}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor={item.activo ? '#FFFFFF' : '#FFFFFF'}
          />
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => editarTarifa(item)}
          >
            <MaterialCommunityIcons name="pencil" size={16} color="#6B7280" />
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Configuración del Sistema</Text>
        <TouchableOpacity 
          style={styles.helpBtn} 
          onPress={() => Alert.alert('Ayuda', 'Guía de configuración del sistema')}
        >
          <MaterialCommunityIcons name="help-circle" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        {/* Estado del sistema */}
        <View style={styles.systemStatusContainer}>
          <Text style={styles.sectionTitle}>🔧 Estado del Sistema</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
              <Text style={styles.statusLabel}>Sistema</Text>
              <Text style={[styles.statusValue, { color: '#10B981' }]}>Activo</Text>
            </View>
            
            <View style={styles.statusCard}>
              <MaterialCommunityIcons name="database" size={24} color="#3B82F6" />
              <Text style={styles.statusLabel}>Base de Datos</Text>
              <Text style={[styles.statusValue, { color: '#3B82F6' }]}>Conectada</Text>
            </View>
            
            <View style={styles.statusCard}>
              <MaterialCommunityIcons name="backup-restore" size={24} color="#8B5CF6" />
              <Text style={styles.statusLabel}>Último Backup</Text>
              <Text style={[styles.statusValue, { color: '#8B5CF6' }]}>Hoy 02:00</Text>
            </View>
          </View>
        </View>

        {/* Configuraciones */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>⚙️ Configuraciones</Text>
          <FlatList
            data={configuracionesSistema}
            keyExtractor={(item) => item.id}
            renderItem={renderConfiguracion}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Modal Tarifas */}
      <Modal
        visible={modalTarifas}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalTarifas(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💰 Tarifas de Servicios</Text>
              <TouchableOpacity onPress={() => setModalTarifas(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={tarifas}
              keyExtractor={(item) => item.id}
              renderItem={renderTarifa}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Editar Tarifa */}
      <Modal
        visible={!!tarifaEditando}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTarifaEditando(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✏️ Editar Tarifa</Text>
              <TouchableOpacity onPress={() => setTarifaEditando(null)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {tarifaEditando && (
              <View style={styles.editForm}>
                <Text style={styles.fieldLabel}>Servicio</Text>
                <Text style={styles.serviceName}>{tarifaEditando.servicio}</Text>
                
                <Text style={styles.fieldLabel}>Precio ($)</Text>
                <TextInput
                  style={styles.input}
                  value={tarifaEditando.precio.toString()}
                  onChangeText={(text) => setTarifaEditando({
                    ...tarifaEditando,
                    precio: parseInt(text) || 0
                  })}
                  keyboardType="numeric"
                  placeholder="Precio del servicio"
                />
                
                <Text style={styles.fieldLabel}>Tiempo (minutos)</Text>
                <TextInput
                  style={styles.input}
                  value={tarifaEditando.tiempo.toString()}
                  onChangeText={(text) => setTarifaEditando({
                    ...tarifaEditando,
                    tiempo: parseInt(text) || 0
                  })}
                  keyboardType="numeric"
                  placeholder="Tiempo estimado"
                />
                
                <TouchableOpacity style={styles.saveBtn} onPress={guardarTarifa}>
                  <Text style={styles.saveBtnText}>💾 Guardar Cambios</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Notificaciones */}
      <Modal
        visible={modalNotificaciones}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalNotificaciones(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔔 Configuración de Notificaciones</Text>
              <TouchableOpacity onPress={() => setModalNotificaciones(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.notificationSettings}>
              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <MaterialCommunityIcons name="email" size={24} color="#3B82F6" />
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>Notificaciones por Email</Text>
                    <Text style={styles.notificationDesc}>Enviar alertas importantes por correo</Text>
                  </View>
                </View>
                <Switch
                  value={configuracion.notificaciones.email}
                  onValueChange={() => toggleNotificacion('email')}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <MaterialCommunityIcons name="message" size={24} color="#10B981" />
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>Notificaciones SMS</Text>
                    <Text style={styles.notificationDesc}>Mensajes de texto para actualizaciones</Text>
                  </View>
                </View>
                <Switch
                  value={configuracion.notificaciones.sms}
                  onValueChange={() => toggleNotificacion('sms')}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>WhatsApp Business</Text>
                    <Text style={styles.notificationDesc}>Comunicación directa con clientes</Text>
                  </View>
                </View>
                <Switch
                  value={configuracion.notificaciones.whatsapp}
                  onValueChange={() => toggleNotificacion('whatsapp')}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <MaterialCommunityIcons name="bell" size={24} color="#F59E0B" />
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>Push Notifications</Text>
                    <Text style={styles.notificationDesc}>Notificaciones en tiempo real</Text>
                  </View>
                </View>
                <Switch
                  value={configuracion.notificaciones.pushNotifications}
                  onValueChange={() => toggleNotificacion('pushNotifications')}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal QR */}
      <Modal
        visible={modalQR}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalQR(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📱 Configuración de QR</Text>
              <TouchableOpacity onPress={() => setModalQR(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrSettings}>
              <View style={styles.qrOption}>
                <Text style={styles.qrLabel}>Incluir logo de la empresa</Text>
                <Switch
                  value={configuracion.qrPersonalizacion.incluirLogo}
                  onValueChange={(value) => setConfiguracion(prev => ({
                    ...prev,
                    qrPersonalizacion: { ...prev.qrPersonalizacion, incluirLogo: value }
                  }))}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.qrOption}>
                <Text style={styles.qrLabel}>Color del QR</Text>
                <View style={styles.colorOptions}>
                  {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'].map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorBtn, { backgroundColor: color }, 
                        configuracion.qrPersonalizacion.color === color && styles.colorSelected]}
                      onPress={() => setConfiguracion(prev => ({
                        ...prev,
                        qrPersonalizacion: { ...prev.qrPersonalizacion, color }
                      }))}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.qrOption}>
                <Text style={styles.qrLabel}>Mensaje personalizado</Text>
                <TextInput
                  style={styles.input}
                  value={configuracion.qrPersonalizacion.mensaje}
                  onChangeText={(text) => setConfiguracion(prev => ({
                    ...prev,
                    qrPersonalizacion: { ...prev.qrPersonalizacion, mensaje: text }
                  }))}
                  placeholder="Mensaje que aparece con el QR"
                  multiline
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Respaldo */}
      <Modal
        visible={modalRespaldo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalRespaldo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🛡️ Respaldos y Seguridad</Text>
              <TouchableOpacity onPress={() => setModalRespaldo(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.backupSettings}>
              <TouchableOpacity style={styles.backupBtn}>
                <MaterialCommunityIcons name="backup-restore" size={24} color="#3B82F6" />
                <Text style={styles.backupBtnText}>Crear Respaldo Manual</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.backupBtn}>
                <MaterialCommunityIcons name="download" size={24} color="#10B981" />
                <Text style={styles.backupBtnText}>Restaurar desde Respaldo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.backupBtn}>
                <MaterialCommunityIcons name="lock" size={24} color="#F59E0B" />
                <Text style={styles.backupBtnText}>Cambiar Contraseña Admin</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.backupBtn}>
                <MaterialCommunityIcons name="shield-check" size={24} color="#8B5CF6" />
                <Text style={styles.backupBtnText}>Configurar 2FA</Text>
              </TouchableOpacity>
            </View>
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
  helpBtn: {
    padding: 8,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  systemStatusContainer: {
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
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  statusValue: {
    fontSize: 12,
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
  configCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  configIcon: {
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  configInfo: {
    flex: 1,
  },
  configNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  configDescripcion: {
    fontSize: 12,
    color: '#6B7280',
  },
  configActions: {
    alignItems: 'center',
    gap: 8,
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
  editModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    padding: 20,
  },
  tarifaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tarifaInfo: {
    flex: 1,
  },
  tarifaNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  tarifaCategoria: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 2,
  },
  tarifaTiempo: {
    fontSize: 12,
    color: '#6B7280',
  },
  tarifaMeta: {
    alignItems: 'center',
    gap: 8,
  },
  tarifaPrecio: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  editBtn: {
    padding: 4,
  },
  editForm: {
    padding: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 16,
  },
  serviceName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationSettings: {
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationText: {
    marginLeft: 12,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  notificationDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  qrSettings: {
    padding: 20,
  },
  qrOption: {
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#374151',
  },
  backupSettings: {
    padding: 20,
    gap: 16,
  },
  backupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  backupBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
