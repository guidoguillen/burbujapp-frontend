import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Turno'>;

interface TurnoData {
  fecha: string;
  horaInicio: string;
  horaEntrada?: string;
  cajaInicial?: number;
  horaSalida?: string;
  cajaFinal?: number;
  totalVentas?: number;
  observaciones?: string;
}

export const TurnoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // Número del administrador para envío de reportes
  const ADMIN_WHATSAPP = '+59179954303';
  
  const [turnoActual, setTurnoActual] = useState<TurnoData>({
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '08:00'
  });
  
  const [modalEntradaVisible, setModalEntradaVisible] = useState(false);
  const [modalSalidaVisible, setModalSalidaVisible] = useState(false);
  const [cajaInicialInput, setCajaInicialInput] = useState('');
  const [cajaFinalInput, setCajaFinalInput] = useState('');
  const [observacionesInput, setObservacionesInput] = useState('');
  const [tiempoActual, setTiempoActual] = useState(new Date());

  // Actualizar reloj cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatearHora = (fecha: Date): string => {
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatearFecha = (fecha: Date): string => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const enviarReportePorWhatsApp = async () => {
    if (!turnoActual.horaEntrada || !turnoActual.horaSalida) {
      Alert.alert('Error', 'El turno debe estar completado para enviar el reporte');
      return;
    }

    // Mostrar confirmación antes de enviar
    Alert.alert(
      '📱 Enviar Reporte',
      `¿Enviar reporte del turno al administrador (${ADMIN_WHATSAPP})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: async () => {
            // Crear el mensaje del reporte
            const fecha = new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            const mensaje = `🏪 *REPORTE DIARIO DE TURNO*
══════════════════════════

📅 *Fecha:* ${fecha}
👤 *Operador:* opr (ejemplo)
⏰ *Horario:* ${turnoActual.horaEntrada} - ${turnoActual.horaSalida}

💰 *CONTROL DE CAJA*
• Caja inicial: ${turnoActual.cajaInicial} Bs
• Caja final: ${turnoActual.cajaFinal} Bs
• Total ventas: ${turnoActual.totalVentas} Bs${turnoActual.observaciones ? `\n\n📝 *Observaciones:*\n${turnoActual.observaciones}` : ''}

══════════════════════════
_Reporte automático - BurbujApp_ 🧼✨`;

            // Codificar el mensaje para URL
            const mensajeCodificado = encodeURIComponent(mensaje);
            const url = `whatsapp://send?phone=${ADMIN_WHATSAPP}&text=${mensajeCodificado}`;

            try {
              // Verificar si WhatsApp está instalado
              const supported = await Linking.canOpenURL(url);
              
              if (supported) {
                await Linking.openURL(url);
              } else {
                // Fallback para web WhatsApp
                const webUrl = `https://wa.me/${ADMIN_WHATSAPP.replace('+', '')}?text=${mensajeCodificado}`;
                await Linking.openURL(webUrl);
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'No se pudo abrir WhatsApp. Asegúrate de tener la aplicación instalada.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  const handleRegistrarEntrada = () => {
    setModalEntradaVisible(true);
  };

  const confirmarEntrada = () => {
    if (!cajaInicialInput.trim()) {
      Alert.alert('Error', 'Por favor ingresa la caja inicial');
      return;
    }

    const cajaInicial = parseFloat(cajaInicialInput);
    if (isNaN(cajaInicial) || cajaInicial < 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    const horaEntrada = formatearHora(new Date());
    
    setTurnoActual(prev => ({
      ...prev,
      horaEntrada,
      cajaInicial
    }));

    setCajaInicialInput('');
    setModalEntradaVisible(false);
    
    Alert.alert(
      '✅ Entrada registrada',
      `Hora: ${horaEntrada}\nCaja inicial: ${cajaInicial} Bs`,
      [{ text: 'OK' }]
    );
  };

  const handleRegistrarSalida = () => {
    setModalSalidaVisible(true);
  };

  const confirmarSalida = () => {
    if (!cajaFinalInput.trim()) {
      Alert.alert('Error', 'Por favor ingresa la caja final');
      return;
    }

    const cajaFinal = parseFloat(cajaFinalInput);
    if (isNaN(cajaFinal) || cajaFinal < 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    const horaSalida = formatearHora(new Date());
    const totalVentas = cajaFinal - (turnoActual.cajaInicial || 0);
    
    setTurnoActual(prev => ({
      ...prev,
      horaSalida,
      cajaFinal,
      totalVentas,
      observaciones: observacionesInput
    }));

    setCajaFinalInput('');
    setObservacionesInput('');
    setModalSalidaVisible(false);
    
    // Mostrar resumen del turno
    Alert.alert(
      '🎯 Turno completado',
      `Entrada: ${turnoActual.horaEntrada} | Salida: ${horaSalida}\nCaja inicial: ${turnoActual.cajaInicial} Bs\nCaja final: ${cajaFinal} Bs\nTotal ventas: ${totalVentas} Bs`,
      [{ text: 'OK' }]
    );
  };

  const reiniciarTurno = () => {
    Alert.alert(
      'Reiniciar turno',
      '¿Estás seguro de que quieres reiniciar el turno actual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: () => {
            setTurnoActual({
              fecha: new Date().toISOString().split('T')[0],
              horaInicio: '08:00'
            });
          }
        }
      ]
    );
  };

  const turnoEnCurso = !!turnoActual.horaEntrada && !turnoActual.horaSalida;
  const turnoCompletado = !!turnoActual.horaEntrada && !!turnoActual.horaSalida;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Control de Turno</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={reiniciarTurno}>
          <MaterialCommunityIcons name="refresh" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Reloj y fecha actual */}
        <View style={styles.clockContainer}>
          <Text style={styles.clockTime}>{formatearHora(tiempoActual)}</Text>
          <Text style={styles.clockDate}>{formatearFecha(tiempoActual)}</Text>
        </View>

        {/* Estado del turno */}
        <View style={styles.statusContainer}>
          <View style={styles.statusHeader}>
            <MaterialCommunityIcons 
              name={turnoEnCurso ? "clock-check" : turnoCompletado ? "check-circle" : "clock-outline"} 
              size={24} 
              color={turnoEnCurso ? "#059669" : turnoCompletado ? "#3B82F6" : "#6B7280"} 
            />
            <Text style={styles.statusTitle}>
              {turnoEnCurso ? "Turno en curso" : turnoCompletado ? "Turno completado" : "Sin turno activo"}
            </Text>
          </View>

          {/* Información del turno */}
          {turnoActual.horaEntrada && (
            <View style={styles.turnoInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Entrada:</Text>
                <Text style={styles.infoValue}>{turnoActual.horaEntrada}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Caja inicial:</Text>
                <Text style={styles.infoValue}>{turnoActual.cajaInicial} Bs</Text>
              </View>

              {turnoActual.horaSalida && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Salida:</Text>
                    <Text style={styles.infoValue}>{turnoActual.horaSalida}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Caja final:</Text>
                    <Text style={styles.infoValue}>{turnoActual.cajaFinal} Bs</Text>
                  </View>
                  
                  <View style={[styles.infoRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total ventas:</Text>
                    <Text style={styles.totalValue}>{turnoActual.totalVentas} Bs</Text>
                  </View>

                  {turnoActual.observaciones && (
                    <View style={styles.observacionesContainer}>
                      <Text style={styles.infoLabel}>Observaciones:</Text>
                      <Text style={styles.observacionesText}>{turnoActual.observaciones}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          {!turnoActual.horaEntrada && (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleRegistrarEntrada}>
              <MaterialCommunityIcons name="clock-in" size={20} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Registrar Entrada</Text>
            </TouchableOpacity>
          )}

          {turnoEnCurso && (
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleRegistrarSalida}>
              <MaterialCommunityIcons name="clock-out" size={20} color="#FFFFFF" />
              <Text style={styles.secondaryBtnText}>Registrar Salida</Text>
            </TouchableOpacity>
          )}

          {turnoCompletado && (
            <TouchableOpacity style={styles.whatsappBtn} onPress={enviarReportePorWhatsApp}>
              <MaterialCommunityIcons name="whatsapp" size={20} color="#FFFFFF" />
              <Text style={styles.whatsappBtnText}>Enviar Reporte al Admin</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Modal de entrada */}
      <Modal
        visible={modalEntradaVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalEntradaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="clock-in" size={24} color="#059669" />
              <Text style={styles.modalTitle}>Registrar Entrada</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalLabel}>Caja inicial (Bs)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: 150.00"
                value={cajaInicialInput}
                onChangeText={setCajaInicialInput}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalEntradaVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmarEntrada}>
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de salida */}
      <Modal
        visible={modalSalidaVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalSalidaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="clock-out" size={24} color="#DC2626" />
              <Text style={styles.modalTitle}>Registrar Salida</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalLabel}>Caja final (Bs)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: 490.00"
                value={cajaFinalInput}
                onChangeText={setCajaFinalInput}
                keyboardType="numeric"
                autoFocus
              />

              <Text style={[styles.modalLabel, { marginTop: 16 }]}>Observaciones (opcional)</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Ej: Sin novedades"
                value={observacionesInput}
                onChangeText={setObservacionesInput}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalSalidaVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmarSalida}>
                <Text style={styles.confirmBtnText}>Confirmar</Text>
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
  resetBtn: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  clockContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  clockTime: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  clockDate: {
    fontSize: 16,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  turnoInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    color: '#059669',
    fontWeight: '700',
  },
  observacionesContainer: {
    marginTop: 12,
  },
  observacionesText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
