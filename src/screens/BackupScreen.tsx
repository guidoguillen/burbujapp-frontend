import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Modal,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { BackupService } from '@/services/BackupService';

interface BackupConfig {
  auto_backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  max_backups: number;
  include_images: boolean;
  backup_location: 'local' | 'cloud';
}

interface BackupInfo {
  filename: string;
  date: string;
  size: number;
  manual: boolean;
}

export const BackupScreen: React.FC = () => {
  const [config, setConfig] = useState<BackupConfig | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    try {
      await BackupService.getInstance().initialize();
      await cargarConfiguracion();
      await cargarBackups();
    } catch (error) {
      console.error('Error inicializando backup screen:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarConfiguracion = async () => {
    try {
      const backupConfig = await BackupService.getInstance().getBackupConfig();
      setConfig(backupConfig);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const cargarBackups = async () => {
    try {
      const backupList = await BackupService.getInstance().listarBackups();
      setBackups(backupList);
    } catch (error) {
      console.error('Error cargando backups:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarBackups();
    setRefreshing(false);
  };

  const crearBackupManual = async () => {
    try {
      Alert.alert(
        'Crear Backup',
        '¿Deseas crear un backup manual de todos los datos?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Crear',
            onPress: async () => {
              try {
                setLoading(true);
                const filepath = await BackupService.getInstance().crearBackupCompleto(true);
                if (filepath) {
                  Alert.alert(
                    'Backup Creado',
                    'El backup se ha creado correctamente. ¿Deseas exportarlo?',
                    [
                      { text: 'No', style: 'cancel' },
                      {
                        text: 'Exportar',
                        onPress: () => BackupService.getInstance().exportarBackup(filepath),
                      },
                    ]
                  );
                  await cargarBackups();
                }
              } catch (error) {
                Alert.alert('Error', 'No se pudo crear el backup');
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creando backup manual:', error);
    }
  };

  const importarBackup = async () => {
    try {
      await BackupService.getInstance().importarBackup();
      await cargarBackups();
    } catch (error) {
      console.error('Error importando backup:', error);
    }
  };

  const exportarBackup = async (backup: BackupInfo) => {
    try {
      const filepath = `${FileSystem.documentDirectory}backups/${backup.filename}`;
      await BackupService.getInstance().exportarBackup(filepath);
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar el backup');
    }
  };

  const eliminarBackup = async (backup: BackupInfo) => {
    Alert.alert(
      'Eliminar Backup',
      `¿Estás seguro de que deseas eliminar el backup del ${new Date(backup.date).toLocaleDateString()}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await BackupService.getInstance().eliminarBackup(backup.filename);
              await cargarBackups();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el backup');
            }
          },
        },
      ]
    );
  };

  const actualizarConfiguracion = async (nuevaConfig: BackupConfig) => {
    try {
      await BackupService.getInstance().saveBackupConfig(nuevaConfig);
      setConfig(nuevaConfig);
      setConfigModalVisible(false);
      Alert.alert('Éxito', 'Configuración guardada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
  };

  const formatearTamaño = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderBackupItem = (backup: BackupInfo) => (
    <View key={backup.filename} style={styles.backupItem}>
      <View style={styles.backupInfo}>
        <View style={styles.backupHeader}>
          <MaterialCommunityIcons
            name={backup.manual ? "folder-account" : "update"}
            size={20}
            color={backup.manual ? "#8B5CF6" : "#3B82F6"}
          />
          <View style={styles.backupDetails}>
            <Text style={styles.backupDate}>
              {new Date(backup.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.backupSize}>
              {formatearTamaño(backup.size)} • {backup.manual ? 'Manual' : 'Automático'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.backupActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => exportarBackup(backup)}
        >
          <MaterialCommunityIcons name="export" size={16} color="#059669" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => eliminarBackup(backup)}
        >
          <MaterialCommunityIcons name="delete" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfigModal = () => {
    if (!config) return null;

    return (
      <Modal
        visible={configModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setConfigModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Configuración de Backup</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.configSection}>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Backup Automático</Text>
                <Switch
                  value={config.auto_backup_enabled}
                  onValueChange={(value) =>
                    setConfig({ ...config, auto_backup_enabled: value })
                  }
                />
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Frecuencia</Text>
                <View style={styles.frequencyButtons}>
                  {['daily', 'weekly', 'monthly'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        config.backup_frequency === freq && styles.frequencyButtonActive,
                      ]}
                      onPress={() =>
                        setConfig({ ...config, backup_frequency: freq as any })
                      }
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          config.backup_frequency === freq && styles.frequencyButtonTextActive,
                        ]}
                      >
                        {freq === 'daily' ? 'Diario' : freq === 'weekly' ? 'Semanal' : 'Mensual'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Máximo de Backups</Text>
                <View style={styles.maxBackupsContainer}>
                  {[3, 5, 10, 15].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.maxBackupButton,
                        config.max_backups === num && styles.maxBackupButtonActive,
                      ]}
                      onPress={() => setConfig({ ...config, max_backups: num })}
                    >
                      <Text
                        style={[
                          styles.maxBackupButtonText,
                          config.max_backups === num && styles.maxBackupButtonTextActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => actualizarConfiguracion(config)}
            >
              <Text style={styles.saveButtonText}>Guardar Configuración</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="loading" size={48} color="#3B82F6" />
        <Text style={styles.loadingText}>Cargando backups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Backup y Restauración</Text>
        <TouchableOpacity
          style={styles.configButton}
          onPress={() => setConfigModalVisible(true)}
        >
          <MaterialCommunityIcons name="cog" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="folder-multiple" size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>{backups.length}</Text>
          <Text style={styles.statLabel}>Backups</Text>
        </View>

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#059669" />
          <Text style={styles.statNumber}>
            {config?.auto_backup_enabled ? 'Activo' : 'Inactivo'}
          </Text>
          <Text style={styles.statLabel}>Auto Backup</Text>
        </View>

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="calendar" size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>
            {config?.backup_frequency === 'daily' ? 'Diario' : 
             config?.backup_frequency === 'weekly' ? 'Semanal' : 'Mensual'}
          </Text>
          <Text style={styles.statLabel}>Frecuencia</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={crearBackupManual}>
          <MaterialCommunityIcons name="backup-restore" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Crear Backup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={importarBackup}>
          <MaterialCommunityIcons name="import" size={20} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>Importar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.backupsContainer}>
        <Text style={styles.sectionTitle}>Backups Disponibles</Text>
        
        <ScrollView
          style={styles.backupsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {backups.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="folder-open" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay backups disponibles</Text>
              <Text style={styles.emptySubtext}>
                Crea tu primer backup para comenzar
              </Text>
            </View>
          ) : (
            backups.map(renderBackupItem)
          )}
        </ScrollView>
      </View>

      {renderConfigModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  configButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  backupsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  backupsList: {
    flex: 1,
  },
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backupInfo: {
    flex: 1,
  },
  backupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backupDetails: {
    marginLeft: 12,
  },
  backupDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  backupSize: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  backupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  configSection: {
    paddingVertical: 20,
  },
  configItem: {
    marginBottom: 24,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  frequencyButtonTextActive: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  maxBackupsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  maxBackupButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  maxBackupButtonActive: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  maxBackupButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  maxBackupButtonTextActive: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
