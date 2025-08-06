import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

export interface BackupData {
  timestamp: string;
  version: string;
  data: {
    ordenes: any[];
    clientes: any[];
    turnos: any[];
    configuracion: any;
    plantillas_servicios: any[];
  };
}

export interface BackupConfig {
  auto_backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  max_backups: number;
  include_images: boolean;
  backup_location: 'local' | 'cloud';
}

const BACKUP_KEYS = {
  CONFIG: '@backup_config',
  LAST_BACKUP: '@last_backup_date',
  AUTO_BACKUP_LIST: '@auto_backup_list',
};

const DEFAULT_CONFIG: BackupConfig = {
  auto_backup_enabled: true,
  backup_frequency: 'weekly',
  max_backups: 5,
  include_images: false,
  backup_location: 'local',
};

export class BackupService {
  private static instance: BackupService;
  private isInitialized = false;

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  // Inicializar el servicio de backup
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Crear directorio de backups si no existe
      const backupDir = `${FileSystem.documentDirectory}backups/`;
      const dirInfo = await FileSystem.getInfoAsync(backupDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
      }

      // Verificar configuración inicial
      const config = await this.getBackupConfig();
      if (!config) {
        await this.saveBackupConfig(DEFAULT_CONFIG);
      }

      this.isInitialized = true;
      console.log('✅ BackupService inicializado');
    } catch (error) {
      console.error('❌ Error inicializando BackupService:', error);
    }
  }

  // Configuración de backup
  async getBackupConfig(): Promise<BackupConfig | null> {
    try {
      const configJson = await AsyncStorage.getItem(BACKUP_KEYS.CONFIG);
      return configJson ? JSON.parse(configJson) : null;
    } catch (error) {
      console.error('Error obteniendo configuración de backup:', error);
      return null;
    }
  }

  async saveBackupConfig(config: BackupConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(BACKUP_KEYS.CONFIG, JSON.stringify(config));
      console.log('Configuración de backup guardada');
    } catch (error) {
      console.error('Error guardando configuración de backup:', error);
      throw error;
    }
  }

  // Crear backup completo
  async crearBackupCompleto(manual: boolean = false): Promise<string | null> {
    try {
      console.log('📦 Iniciando backup completo...');

      // Recopilar todos los datos
      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          ordenes: await this.obtenerDatos('@ordenes') || [],
          clientes: await this.obtenerDatos('@clientes') || [],
          turnos: await this.obtenerDatos('@turnos') || [],
          configuracion: await this.obtenerDatos('@configuracion') || {},
          plantillas_servicios: await this.obtenerDatos('@plantillas_servicios') || [],
        },
      };

      // Crear nombre del archivo
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `backup_${timestamp}_${Date.now()}.json`;
      const filepath = `${FileSystem.documentDirectory}backups/${filename}`;

      // Guardar archivo
      await FileSystem.writeAsStringAsync(
        filepath,
        JSON.stringify(backupData, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      // Actualizar lista de backups
      await this.actualizarListaBackups(filename, manual);

      // Limpiar backups antiguos
      await this.limpiarBackupsAntiguos();

      // Actualizar fecha del último backup
      await AsyncStorage.setItem(BACKUP_KEYS.LAST_BACKUP, new Date().toISOString());

      console.log(`✅ Backup creado: ${filename}`);
      return filepath;
    } catch (error) {
      console.error('❌ Error creando backup:', error);
      throw error;
    }
  }

  // Restaurar backup
  async restaurarBackup(backupData: BackupData): Promise<void> {
    try {
      console.log('🔄 Iniciando restauración de backup...');

      // Crear backup de seguridad antes de restaurar
      await this.crearBackupCompleto();

      // Restaurar cada tipo de dato
      const { data } = backupData;

      if (data.ordenes) {
        await this.guardarDatos('@ordenes', data.ordenes);
      }

      if (data.clientes) {
        await this.guardarDatos('@clientes', data.clientes);
      }

      if (data.turnos) {
        await this.guardarDatos('@turnos', data.turnos);
      }

      if (data.configuracion) {
        await this.guardarDatos('@configuracion', data.configuracion);
      }

      if (data.plantillas_servicios) {
        await this.guardarDatos('@plantillas_servicios', data.plantillas_servicios);
      }

      console.log('✅ Backup restaurado correctamente');
    } catch (error) {
      console.error('❌ Error restaurando backup:', error);
      throw error;
    }
  }

  // Importar backup desde archivo
  async importarBackup(): Promise<void> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const backupData: BackupData = JSON.parse(fileContent);

      // Validar estructura del backup
      if (!this.validarBackupData(backupData)) {
        throw new Error('Archivo de backup inválido');
      }

      Alert.alert(
        'Confirmar Restauración',
        `¿Deseas restaurar el backup del ${new Date(backupData.timestamp).toLocaleDateString()}?\n\nEsto reemplazará todos los datos actuales.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Restaurar',
            style: 'destructive',
            onPress: async () => {
              await this.restaurarBackup(backupData);
              Alert.alert('Éxito', 'Backup restaurado correctamente');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error importando backup:', error);
      Alert.alert('Error', 'No se pudo importar el backup. Verifica que el archivo sea válido.');
    }
  }

  // Exportar backup
  async exportarBackup(filepath: string): Promise<void> {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo');
        return;
      }

      await Sharing.shareAsync(filepath, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar Backup',
      });
    } catch (error) {
      console.error('Error exportando backup:', error);
      Alert.alert('Error', 'No se pudo exportar el backup');
    }
  }

  // Listar backups disponibles
  async listarBackups(): Promise<{ filename: string; date: string; size: number; manual: boolean }[]> {
    try {
      const backupDir = `${FileSystem.documentDirectory}backups/`;
      const dirContents = await FileSystem.readDirectoryAsync(backupDir);
      
      const backups = [];
      const backupList = await this.obtenerListaBackups();

      for (const filename of dirContents) {
        if (filename.endsWith('.json')) {
          const filepath = `${backupDir}${filename}`;
          const fileInfo = await FileSystem.getInfoAsync(filepath);
          
          if (fileInfo.exists) {
            const backupInfo = backupList.find(b => b.filename === filename);
            backups.push({
              filename,
              date: new Date(fileInfo.modificationTime! * 1000).toISOString(),
              size: fileInfo.size || 0,
              manual: backupInfo?.manual || false,
            });
          }
        }
      }

      return backups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error listando backups:', error);
      return [];
    }
  }

  // Eliminar backup
  async eliminarBackup(filename: string): Promise<void> {
    try {
      const filepath = `${FileSystem.documentDirectory}backups/${filename}`;
      await FileSystem.deleteAsync(filepath);
      
      // Actualizar lista
      const backupList = await this.obtenerListaBackups();
      const updatedList = backupList.filter(b => b.filename !== filename);
      await AsyncStorage.setItem(BACKUP_KEYS.AUTO_BACKUP_LIST, JSON.stringify(updatedList));
      
      console.log(`🗑️ Backup eliminado: ${filename}`);
    } catch (error) {
      console.error('Error eliminando backup:', error);
      throw error;
    }
  }

  // Verificar si necesita backup automático
  async verificarBackupAutomatico(): Promise<void> {
    try {
      const config = await this.getBackupConfig();
      if (!config?.auto_backup_enabled) return;

      const lastBackupStr = await AsyncStorage.getItem(BACKUP_KEYS.LAST_BACKUP);
      if (!lastBackupStr) {
        // Primera vez, crear backup
        await this.crearBackupCompleto();
        return;
      }

      const lastBackup = new Date(lastBackupStr);
      const now = new Date();
      const diffMs = now.getTime() - lastBackup.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let needsBackup = false;

      switch (config.backup_frequency) {
        case 'daily':
          needsBackup = diffDays >= 1;
          break;
        case 'weekly':
          needsBackup = diffDays >= 7;
          break;
        case 'monthly':
          needsBackup = diffDays >= 30;
          break;
      }

      if (needsBackup) {
        console.log('🔄 Creando backup automático...');
        await this.crearBackupCompleto();
      }
    } catch (error) {
      console.error('Error verificando backup automático:', error);
    }
  }

  // Métodos privados
  private async obtenerDatos(key: string): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error obteniendo datos para ${key}:`, error);
      return null;
    }
  }

  private async guardarDatos(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error guardando datos para ${key}:`, error);
      throw error;
    }
  }

  private async obtenerListaBackups(): Promise<{ filename: string; manual: boolean; date: string }[]> {
    try {
      const listJson = await AsyncStorage.getItem(BACKUP_KEYS.AUTO_BACKUP_LIST);
      return listJson ? JSON.parse(listJson) : [];
    } catch (error) {
      return [];
    }
  }

  private async actualizarListaBackups(filename: string, manual: boolean): Promise<void> {
    try {
      const backupList = await this.obtenerListaBackups();
      backupList.push({
        filename,
        manual,
        date: new Date().toISOString(),
      });
      await AsyncStorage.setItem(BACKUP_KEYS.AUTO_BACKUP_LIST, JSON.stringify(backupList));
    } catch (error) {
      console.error('Error actualizando lista de backups:', error);
    }
  }

  private async limpiarBackupsAntiguos(): Promise<void> {
    try {
      const config = await this.getBackupConfig();
      if (!config) return;

      const backups = await this.listarBackups();
      const backupsAutomaticos = backups.filter(b => !b.manual);

      if (backupsAutomaticos.length > config.max_backups) {
        const backupsAEliminar = backupsAutomaticos
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, backupsAutomaticos.length - config.max_backups);

        for (const backup of backupsAEliminar) {
          await this.eliminarBackup(backup.filename);
        }

        console.log(`🧹 ${backupsAEliminar.length} backups antiguos eliminados`);
      }
    } catch (error) {
      console.error('Error limpiando backups antiguos:', error);
    }
  }

  private validarBackupData(data: any): boolean {
    try {
      return (
        data &&
        typeof data === 'object' &&
        data.timestamp &&
        data.version &&
        data.data &&
        typeof data.data === 'object'
      );
    } catch (error) {
      return false;
    }
  }
}

export default BackupService.getInstance();
