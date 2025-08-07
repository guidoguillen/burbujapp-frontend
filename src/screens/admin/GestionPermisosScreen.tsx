import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'GestionPermisos'>;

interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  accion: string;
  nivel: 'lectura' | 'escritura' | 'eliminacion' | 'administracion';
  activo: boolean;
}

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  usuariosAsignados: number;
  activo: boolean;
  esRolSistema: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

interface AsignacionUsuario {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rolId: string;
  rolNombre: string;
  fechaAsignacion: string;
  activo: boolean;
}

type VistaActiva = 'roles' | 'permisos' | 'asignaciones';

export const GestionPermisosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('roles');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionUsuario[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Rol | Permiso | AsignacionUsuario | null>(null);
  const [modalType, setModalType] = useState<'crear' | 'editar' | 'detalle' | 'permisos'>('detalle');

  // Mock data para permisos
  const mockPermisos: Permiso[] = [
    {
      id: 'perm_001',
      nombre: 'Ver Órdenes',
      descripcion: 'Visualizar órdenes de lavandería',
      modulo: 'ordenes',
      accion: 'view',
      nivel: 'lectura',
      activo: true
    },
    {
      id: 'perm_002',
      nombre: 'Crear Órdenes',
      descripcion: 'Crear nuevas órdenes de lavandería',
      modulo: 'ordenes',
      accion: 'create',
      nivel: 'escritura',
      activo: true
    },
    {
      id: 'perm_003',
      nombre: 'Editar Órdenes',
      descripcion: 'Modificar órdenes existentes',
      modulo: 'ordenes',
      accion: 'update',
      nivel: 'escritura',
      activo: true
    },
    {
      id: 'perm_004',
      nombre: 'Eliminar Órdenes',
      descripcion: 'Eliminar órdenes del sistema',
      modulo: 'ordenes',
      accion: 'delete',
      nivel: 'eliminacion',
      activo: true
    },
    {
      id: 'perm_005',
      nombre: 'Gestionar Usuarios',
      descripcion: 'Administrar usuarios del sistema',
      modulo: 'usuarios',
      accion: 'manage',
      nivel: 'administracion',
      activo: true
    },
    {
      id: 'perm_006',
      nombre: 'Ver Reportes',
      descripcion: 'Acceso a reportes y analytics',
      modulo: 'reportes',
      accion: 'view',
      nivel: 'lectura',
      activo: true
    },
    {
      id: 'perm_007',
      nombre: 'Gestionar Finanzas',
      descripcion: 'Control financiero y pagos',
      modulo: 'finanzas',
      accion: 'manage',
      nivel: 'administracion',
      activo: true
    },
    {
      id: 'perm_008',
      nombre: 'Configurar Sistema',
      descripcion: 'Configuración general del sistema',
      modulo: 'sistema',
      accion: 'configure',
      nivel: 'administracion',
      activo: true
    }
  ];

  // Mock data para roles
  const mockRoles: Rol[] = [
    {
      id: 'rol_001',
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      permisos: ['perm_001', 'perm_002', 'perm_003', 'perm_004', 'perm_005', 'perm_006', 'perm_007', 'perm_008'],
      usuariosAsignados: 2,
      activo: true,
      esRolSistema: true,
      fechaCreacion: '2025-01-01T00:00:00.000Z',
      fechaModificacion: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 'rol_002',
      nombre: 'Operador',
      descripcion: 'Gestión de órdenes y clientes',
      permisos: ['perm_001', 'perm_002', 'perm_003'],
      usuariosAsignados: 5,
      activo: true,
      esRolSistema: true,
      fechaCreacion: '2025-01-01T00:00:00.000Z',
      fechaModificacion: '2025-08-01T10:00:00.000Z'
    },
    {
      id: 'rol_003',
      nombre: 'Supervisor',
      descripcion: 'Supervisión y reportes',
      permisos: ['perm_001', 'perm_002', 'perm_003', 'perm_006'],
      usuariosAsignados: 3,
      activo: true,
      esRolSistema: false,
      fechaCreacion: '2025-02-15T09:00:00.000Z',
      fechaModificacion: '2025-07-20T14:30:00.000Z'
    },
    {
      id: 'rol_004',
      nombre: 'Solo Lectura',
      descripcion: 'Acceso de solo visualización',
      permisos: ['perm_001', 'perm_006'],
      usuariosAsignados: 1,
      activo: false,
      esRolSistema: false,
      fechaCreacion: '2025-03-01T08:00:00.000Z',
      fechaModificacion: '2025-06-15T16:00:00.000Z'
    }
  ];

  // Mock data para asignaciones
  const mockAsignaciones: AsignacionUsuario[] = [
    {
      id: 'asig_001',
      userId: 'usr_001',
      userName: 'Juan Pérez',
      userEmail: 'juan.perez@burbujapp.com',
      rolId: 'rol_001',
      rolNombre: 'Administrador',
      fechaAsignacion: '2025-01-01T10:00:00.000Z',
      activo: true
    },
    {
      id: 'asig_002',
      userId: 'usr_002',
      userName: 'María García',
      userEmail: 'maria.garcia@burbujapp.com',
      rolId: 'rol_002',
      rolNombre: 'Operador',
      fechaAsignacion: '2025-02-15T14:30:00.000Z',
      activo: true
    },
    {
      id: 'asig_003',
      userId: 'usr_003',
      userName: 'Carlos López',
      userEmail: 'carlos.lopez@burbujapp.com',
      rolId: 'rol_002',
      rolNombre: 'Operador',
      fechaAsignacion: '2025-03-01T09:15:00.000Z',
      activo: true
    },
    {
      id: 'asig_004',
      userId: 'usr_004',
      userName: 'Ana Martínez',
      userEmail: 'ana.martinez@burbujapp.com',
      rolId: 'rol_003',
      rolNombre: 'Supervisor',
      fechaAsignacion: '2025-04-10T11:00:00.000Z',
      activo: true
    },
    {
      id: 'asig_005',
      userId: 'usr_005',
      userName: 'Pedro Rodríguez',
      userEmail: 'pedro.rodriguez@burbujapp.com',
      rolId: 'rol_004',
      rolNombre: 'Solo Lectura',
      fechaAsignacion: '2025-05-05T16:20:00.000Z',
      activo: false
    }
  ];

  useEffect(() => {
    setPermisos(mockPermisos);
    setRoles(mockRoles);
    setAsignaciones(mockAsignaciones);
  }, []);

  const filteredRoles = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    rol.descripcion.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredPermisos = permisos.filter(permiso =>
    permiso.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    permiso.descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
    permiso.modulo.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredAsignaciones = asignaciones.filter(asignacion =>
    asignacion.userName.toLowerCase().includes(searchText.toLowerCase()) ||
    asignacion.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
    asignacion.rolNombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'lectura':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'eye' as const };
      case 'escritura':
        return { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'pencil' as const };
      case 'eliminacion':
        return { backgroundColor: '#FEE2E2', color: '#DC2626', icon: 'delete' as const };
      case 'administracion':
        return { backgroundColor: '#F3E8FF', color: '#7C3AED', icon: 'crown' as const };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', icon: 'help-circle' as const };
    }
  };

  const getPermisoNombre = (permisoId: string) => {
    const permiso = permisos.find(p => p.id === permisoId);
    return permiso ? permiso.nombre : 'Permiso no encontrado';
  };

  const contarPermisosPorNivel = (nivel: string) => {
    return permisos.filter(p => p.nivel === nivel && p.activo).length;
  };

  const toggleRolActivo = (rolId: string) => {
    setRoles(prev => prev.map(rol => 
      rol.id === rolId ? { ...rol, activo: !rol.activo } : rol
    ));
  };

  const togglePermisoActivo = (permisoId: string) => {
    setPermisos(prev => prev.map(permiso => 
      permiso.id === permisoId ? { ...permiso, activo: !permiso.activo } : permiso
    ));
  };

  const duplicarRol = (rol: Rol) => {
    const nuevoRol: Rol = {
      ...rol,
      id: `rol_${Date.now()}`,
      nombre: `${rol.nombre} (Copia)`,
      usuariosAsignados: 0,
      esRolSistema: false,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    };
    setRoles(prev => [...prev, nuevoRol]);
    Alert.alert('✅ Éxito', 'Rol duplicado correctamente');
  };

  const crearNuevoRol = () => {
    setModalType('crear');
    setSelectedItem(null);
    setModalVisible(true);
  };

  const editarPermisos = (rol: Rol) => {
    setSelectedItem(rol);
    setModalType('permisos');
    setModalVisible(true);
  };

  const exportarConfiguracion = () => {
    Alert.alert(
      '📊 Exportar Configuración',
      `Se exportarán ${roles.length} roles y ${permisos.length} permisos`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => Alert.alert('✅ Éxito', 'Configuración exportada correctamente')
        }
      ]
    );
  };

  const renderRol = ({ item }: { item: Rol }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        setSelectedItem(item);
        setModalType('detalle');
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <MaterialCommunityIcons 
            name={item.esRolSistema ? "shield-crown" : "shield-account"} 
            size={20} 
            color={item.activo ? '#3B82F6' : '#9CA3AF'} 
          />
          <Text style={[styles.cardTitle, !item.activo && { color: '#9CA3AF' }]}>
            {item.nombre}
          </Text>
          {item.esRolSistema && (
            <View style={styles.systemBadge}>
              <Text style={styles.systemBadgeText}>SISTEMA</Text>
            </View>
          )}
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.activo ? '#D1FAE5' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: item.activo ? '#065F46' : '#6B7280' }
            ]}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleRolActivo(item.id)}
          disabled={item.esRolSistema}
        >
          <MaterialCommunityIcons 
            name={item.activo ? "toggle-switch" : "toggle-switch-off"} 
            size={24} 
            color={item.esRolSistema ? '#9CA3AF' : (item.activo ? '#10B981' : '#9CA3AF')} 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardDescription}>{item.descripcion}</Text>
      
      <View style={styles.roleDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.permisos.length} permiso{item.permisos.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account-group" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.usuariosAsignados} usuario{item.usuariosAsignados !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.roleActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => editarPermisos(item)}
        >
          <MaterialCommunityIcons name="shield-edit" size={16} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Permisos</Text>
        </TouchableOpacity>
        
        {!item.esRolSistema && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => duplicarRol(item)}
          >
            <MaterialCommunityIcons name="content-copy" size={16} color="#10B981" />
            <Text style={styles.actionButtonText}>Duplicar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderPermiso = ({ item }: { item: Permiso }) => {
    const nivelStyle = getNivelColor(item.nivel);
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => {
          setSelectedItem(item);
          setModalType('detalle');
          setModalVisible(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons 
              name={nivelStyle.icon} 
              size={20} 
              color={item.activo ? nivelStyle.color : '#9CA3AF'} 
            />
            <Text style={[styles.cardTitle, !item.activo && { color: '#9CA3AF' }]}>
              {item.nombre}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: nivelStyle.backgroundColor }]}>
              <Text style={[styles.statusText, { color: nivelStyle.color }]}>
                {item.nivel}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => togglePermisoActivo(item.id)}
          >
            <MaterialCommunityIcons 
              name={item.activo ? "toggle-switch" : "toggle-switch-off"} 
              size={24} 
              color={item.activo ? '#10B981' : '#9CA3AF'} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardDescription}>{item.descripcion}</Text>
        
        <View style={styles.roleDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="folder" size={16} color="#6B7280" />
            <Text style={styles.detailText}>Módulo: {item.modulo}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="cog" size={16} color="#6B7280" />
            <Text style={styles.detailText}>Acción: {item.accion}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAsignacion = ({ item }: { item: AsignacionUsuario }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        setSelectedItem(item);
        setModalType('detalle');
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <MaterialCommunityIcons name="account" size={20} color="#3B82F6" />
          <Text style={styles.cardTitle}>{item.userName}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.activo ? '#D1FAE5' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: item.activo ? '#065F46' : '#6B7280' }
            ]}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.roleDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="email" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.userEmail}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="shield-account" size={16} color="#6B7280" />
          <Text style={styles.detailText}>Rol: {item.rolNombre}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            Asignado: {new Date(item.fechaAsignacion).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getTabCounts = () => {
    return {
      roles: roles.length,
      permisos: permisos.filter(p => p.activo).length,
      asignaciones: asignaciones.filter(a => a.activo).length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Permisos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={exportarConfiguracion}>
            <MaterialCommunityIcons name="download" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={crearNuevoRol}>
            <MaterialCommunityIcons name="plus" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Estadísticas rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="crown" size={20} color="#7C3AED" />
          <Text style={styles.statNumber}>{contarPermisosPorNivel('administracion')}</Text>
          <Text style={styles.statLabel}>Admin</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="pencil" size={20} color="#065F46" />
          <Text style={styles.statNumber}>{contarPermisosPorNivel('escritura')}</Text>
          <Text style={styles.statLabel}>Escritura</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="eye" size={20} color="#1E40AF" />
          <Text style={styles.statNumber}>{contarPermisosPorNivel('lectura')}</Text>
          <Text style={styles.statLabel}>Lectura</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="shield-account" size={20} color="#3B82F6" />
          <Text style={styles.statNumber}>{roles.filter(r => r.activo).length}</Text>
          <Text style={styles.statLabel}>Roles</Text>
        </View>
      </View>

      {/* Tabs de Vista */}
      <View style={styles.tabsContainer}>
        {([
          { key: 'roles', label: 'Roles', icon: 'shield-account', count: tabCounts.roles },
          { key: 'permisos', label: 'Permisos', icon: 'shield-check', count: tabCounts.permisos },
          { key: 'asignaciones', label: 'Asignaciones', icon: 'account-group', count: tabCounts.asignaciones }
        ] as const).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              vistaActiva === tab.key && styles.tabActive
            ]}
            onPress={() => setVistaActiva(tab.key)}
          >
            <MaterialCommunityIcons 
              name={tab.icon} 
              size={16} 
              color={vistaActiva === tab.key ? '#3B82F6' : '#6B7280'} 
            />
            <Text style={[
              styles.tabText,
              vistaActiva === tab.key && styles.tabTextActive
            ]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder={`Buscar ${vistaActiva}...`}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {vistaActiva === 'roles' && (
        <FlatList
          data={filteredRoles}
          keyExtractor={(item) => item.id}
          renderItem={renderRol}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="shield-account" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay roles disponibles</Text>
              <Text style={styles.emptySubtext}>
                {searchText ? 'Prueba con otro término de búsqueda' : 'Crea el primer rol'}
              </Text>
            </View>
          }
        />
      )}
      
      {vistaActiva === 'permisos' && (
        <FlatList
          data={filteredPermisos}
          keyExtractor={(item) => item.id}
          renderItem={renderPermiso}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="shield-check" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay permisos disponibles</Text>
              <Text style={styles.emptySubtext}>
                {searchText ? 'Prueba con otro término de búsqueda' : 'Los permisos aparecerán aquí'}
              </Text>
            </View>
          }
        />
      )}
      
      {vistaActiva === 'asignaciones' && (
        <FlatList
          data={filteredAsignaciones}
          keyExtractor={(item) => item.id}
          renderItem={renderAsignacion}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-group" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay asignaciones disponibles</Text>
              <Text style={styles.emptySubtext}>
                {searchText ? 'Prueba con otro término de búsqueda' : 'Las asignaciones aparecerán aquí'}
              </Text>
            </View>
          }
        />
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'crear' ? 'Crear Rol' : 
                 modalType === 'editar' ? 'Editar' : 
                 modalType === 'permisos' ? 'Gestionar Permisos' : 'Detalles'}
              </Text>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {selectedItem && modalType === 'permisos' && (
                <View>
                  <Text style={styles.modalItemTitle}>
                    Permisos para: {(selectedItem as Rol).nombre}
                  </Text>
                  
                  {permisos.map(permiso => {
                    const isAssigned = (selectedItem as Rol).permisos.includes(permiso.id);
                    const nivelStyle = getNivelColor(permiso.nivel);
                    
                    return (
                      <View key={permiso.id} style={styles.permisoItem}>
                        <View style={styles.permisoInfo}>
                          <MaterialCommunityIcons 
                            name={nivelStyle.icon} 
                            size={16} 
                            color={nivelStyle.color} 
                          />
                          <View style={styles.permisoTexts}>
                            <Text style={styles.permisoNombre}>{permiso.nombre}</Text>
                            <Text style={styles.permisoDescripcion}>{permiso.descripcion}</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.permisoToggle}
                          onPress={() => {
                            // Lógica para toggle permiso
                            Alert.alert('Permiso', `Toggle ${permiso.nombre}`);
                          }}
                        >
                          <MaterialCommunityIcons 
                            name={isAssigned ? "checkbox-marked" : "checkbox-blank-outline"} 
                            size={24} 
                            color={isAssigned ? '#10B981' : '#9CA3AF'} 
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
              
              {selectedItem && modalType === 'detalle' && vistaActiva === 'roles' && (
                <View>
                  <Text style={styles.modalItemTitle}>
                    {(selectedItem as Rol).nombre}
                  </Text>
                  <Text style={styles.modalItemDescription}>
                    {(selectedItem as Rol).descripcion}
                  </Text>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Permisos asignados:</Text>
                    <View style={styles.permisosAsignados}>
                      {(selectedItem as Rol).permisos.map(permisoId => (
                        <View key={permisoId} style={styles.permisoChip}>
                          <Text style={styles.permisoChipText}>
                            {getPermisoNombre(permisoId)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Usuarios asignados:</Text>
                    <Text style={styles.modalDetailValue}>
                      {(selectedItem as Rol).usuariosAsignados}
                    </Text>
                  </View>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Tipo:</Text>
                    <Text style={styles.modalDetailValue}>
                      {(selectedItem as Rol).esRolSistema ? 'Rol del Sistema' : 'Rol Personalizado'}
                    </Text>
                  </View>
                </View>
              )}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#EBF8FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  listContainer: {
    padding: 16,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  systemBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  systemBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  toggleButton: {
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  roleDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  roleActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
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
  modalItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalDetailRow: {
    marginBottom: 16,
  },
  modalDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modalDetailValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  permisosAsignados: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permisoChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
  },
  permisoChipText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  permisoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  permisoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  permisoTexts: {
    flex: 1,
  },
  permisoNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  permisoDescripcion: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  permisoToggle: {
    padding: 4,
  },
});
