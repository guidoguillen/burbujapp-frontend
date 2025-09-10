import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { turnoService, Turno } from '../../services';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Turno'>;

export const TurnoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // Número del administrador para envío de reportes
  const ADMIN_WHATSAPP = '+59179954303';
  
  const [turnoActual, setTurnoActual] = useState<Partial<Turno>>({
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '08:00',
    estado: 'Iniciado'
  });
  
  const [modalEntradaVisible, setModalEntradaVisible] = useState(false);
  const [modalSalidaVisible, setModalSalidaVisible] = useState(false);
  const [modalEditEntradaVisible, setModalEditEntradaVisible] = useState(false);
  const [modalEditSalidaVisible, setModalEditSalidaVisible] = useState(false);
  const [modalEditCajaInicialVisible, setModalEditCajaInicialVisible] = useState(false);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [modalSalidaConfirmacionVisible, setModalSalidaConfirmacionVisible] = useState(false);
  const [confirmacionData, setConfirmacionData] = useState({ hora: '', caja: '' });
  const [salidaData, setSalidaData] = useState({ 
    entrada: '', 
    salida: '', 
    cajaInicial: '', 
    cajaFinal: '', 
    totalVentas: '',
    estadisticas: {
      ordenesHoy: 0,
      clientesAtendidos: 0,
      ventasHoy: 0,
      ordenesPendientes: 0,
      ordenesTerminadas: 0
    }
  });
  const [cajaInicialInput, setCajaInicialInput] = useState('');
  const [cajaFinalInput, setCajaFinalInput] = useState('');
  const [observacionesInput, setObservacionesInput] = useState('');
  const [editEntradaInput, setEditEntradaInput] = useState('');
  const [editSalidaInput, setEditSalidaInput] = useState('');
  const [editCajaInicialInput, setEditCajaInicialInput] = useState('');
  const [tiempoActual, setTiempoActual] = useState(new Date());

  // Función helper para navegación segura
  const navegarSeguro = (destino: string) => {
    try {
      navigation.navigate(destino as any);
    } catch (error) {
      console.log(`Error navegando a ${destino}:`, error);
      try {
        navigation.navigate('Dashboard' as any);
      } catch (fallbackError) {
        console.log(`Error en navegación de fallback a Dashboard:`, fallbackError);
        // Último recurso: resetear navegación
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      }
    }
  };

  // Función helper para volver atrás de forma segura
  const volverAtrasSeguro = () => {
    try {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navegarSeguro('Dashboard');
      }
    } catch (error) {
      console.log('Error en goBack:', error);
      navegarSeguro('Dashboard');
    }
  };

  // Función para verificar estado de navegación
  const verificarEstadoNavegacion = () => {
    try {
      const state = navigation.getState();
      console.log('Estado actual de navegación:', state?.routeNames || 'No disponible');
      return state?.index !== undefined;
    } catch (error) {
      console.log('Error verificando estado de navegación:', error);
      return false;
    }
  };

  // Actualizar reloj cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitorear estado de navegación para debugging
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      console.log('Estado de navegación actualizado:', e.data?.state?.index);
    });

    // Verificar estado inicial
    verificarEstadoNavegacion();

    return unsubscribe;
  }, [navigation]);

  // Componente de botón de navegación robusto
  const NavButton = ({ 
    style, 
    onPress, 
    children, 
    hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
    activeOpacity = 0.7 
  }: {
    style: any;
    onPress: () => void;
    children: React.ReactNode;
    hitSlop?: object;
    activeOpacity?: number;
  }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
      if (isPressed) return; // Prevenir múltiples toques
      
      setIsPressed(true);
      try {
        onPress();
      } catch (error) {
        console.log('Error en NavButton:', error);
      } finally {
        setTimeout(() => setIsPressed(false), 1000);
      }
    };

    return (
      <TouchableOpacity
        style={[style, isPressed && { opacity: 0.5 }]}
        onPress={handlePress}
        hitSlop={hitSlop}
        activeOpacity={activeOpacity}
        disabled={isPressed}
      >
        {children}
      </TouchableOpacity>
    );
  };

  // =================== FUNCIONES DE API ===================
  
  // Cargar turno activo al montar el componente
  useEffect(() => {
    cargarTurnoActivo();
  }, []);

  const cargarTurnoActivo = async () => {
    try {
      const empleado = turnoService.obtenerEmpleadoActual();
      const response = await turnoService.obtenerTurnoActivo(empleado.id);
      
      if (response.success && response.data) {
        setTurnoActual(response.data);
        console.log('Turno activo cargado:', response.data.id);
      } else {
        console.log('No hay turno activo');
      }
    } catch (error) {
      console.log('Error cargando turno activo:', error);
    }
  };

  const crearNuevoTurno = async () => {
    try {
      const empleado = turnoService.obtenerEmpleadoActual();
      const ahora = new Date();
      
      const request = {
        empleadoId: empleado.id,
        empleadoNombre: empleado.nombre,
        horaInicio: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        cajaInicial: turnoActual.cajaInicial
      };

      const response = await turnoService.crearTurno(request);
      
      if (response.success) {
        setTurnoActual(response.data);
        Alert.alert('Éxito', 'Turno creado exitosamente');
        console.log('Turno creado:', response.data.id);
      } else {
        Alert.alert('Error', response.message || 'No se pudo crear el turno');
      }
    } catch (error) {
      console.log('Error creando turno:', error);
      Alert.alert('Error', 'Error interno al crear turno');
    }
  };

  const marcarEntradaTurno = async () => {
    try {
      if (!turnoActual.id) {
        Alert.alert('Error', 'No hay turno activo');
        return;
      }

      const ahora = new Date();
      const horaEntrada = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      
      const response = await turnoService.marcarEntrada(turnoActual.id, horaEntrada);
      
      if (response.success) {
        setTurnoActual(response.data);
        Alert.alert('Éxito', 'Entrada registrada exitosamente');
        console.log('Entrada marcada:', horaEntrada);
      } else {
        Alert.alert('Error', response.message || 'No se pudo marcar la entrada');
      }
    } catch (error) {
      console.log('Error marcando entrada:', error);
      Alert.alert('Error', 'Error interno al marcar entrada');
    }
  };

  const finalizarTurnoAPI = async (cajaFinal: number, observaciones?: string) => {
    try {
      if (!turnoActual.id) {
        Alert.alert('Error', 'No hay turno activo');
        return;
      }

      const ahora = new Date();
      const horaSalida = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const totalVentas = cajaFinal - (turnoActual.cajaInicial || 0);
      
      const request = {
        horaSalida,
        cajaFinal,
        totalVentas,
        observaciones
      };

      const response = await turnoService.finalizarTurno(turnoActual.id, request);
      
      if (response.success) {
        setTurnoActual(response.data);
        Alert.alert('Éxito', 'Turno finalizado exitosamente');
        console.log('Turno finalizado:', response.data.id);
        
        // Enviar reporte por WhatsApp si es necesario
        enviarReportePorWhatsApp();
      } else {
        Alert.alert('Error', response.message || 'No se pudo finalizar el turno');
      }
    } catch (error) {
      console.log('Error finalizando turno:', error);
      Alert.alert('Error', 'Error interno al finalizar turno');
    }
  };

  const actualizarTurnoAPI = async (cambios: Partial<Turno>) => {
    try {
      if (!turnoActual.id) {
        console.log('No hay turno activo para actualizar');
        return;
      }

      const response = await turnoService.actualizarTurno(turnoActual.id, cambios);
      
      if (response.success) {
        setTurnoActual(response.data);
        console.log('Turno actualizado exitosamente');
      } else {
        console.log('Error actualizando turno:', response.message);
      }
    } catch (error) {
      console.log('Error actualizando turno:', error);
    }
  };

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

  // Función para guardar turno en histórico
  const guardarTurnoHistorico = (turnoCompleto: any) => {
    const turnoHistorico = {
      id: Date.now().toString(),
      fecha: turnoCompleto.fecha,
      inicio: turnoCompleto.horaInicio,
      fin: '16:00', // Hora estándar de fin
      estado: 'Finalizado',
      entrada: turnoCompleto.horaEntrada,
      salida: turnoCompleto.horaSalida,
      cajaInicial: turnoCompleto.cajaInicial,
      cajaFinal: turnoCompleto.cajaFinal,
      totalVentas: turnoCompleto.totalVentas,
      observaciones: turnoCompleto.observaciones
    };
    
    // Aquí se guardaría en AsyncStorage o se enviaría a una API
    console.log('Turno guardado en histórico:', turnoHistorico);
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
    
    // Mostrar modal de confirmación personalizado
    setConfirmacionData({ 
      hora: horaEntrada, 
      caja: `${cajaInicial} Bs` 
    });
    setModalConfirmacionVisible(true);
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

    // Guardar en histórico
    const turnoCompleto = {
      ...turnoActual,
      horaSalida,
      cajaFinal,
      totalVentas,
      observaciones: observacionesInput
    };
    guardarTurnoHistorico(turnoCompleto);

    setCajaFinalInput('');
    setObservacionesInput('');
    setModalSalidaVisible(false);
    
    // Mostrar resumen completo del turno con estadísticas del día
    const estadisticasDelDia = {
      ordenesHoy: 12,
      ordenesEnProceso: 0,
      ventasHoy: totalVentas,
      clientesAtendidos: 8,
      ordenesPendientes: 0,
      ordenesTerminadas: 12
    };

    // Datos para el modal de salida
    setSalidaData({
      entrada: turnoActual.horaEntrada || '',
      salida: horaSalida,
      cajaInicial: `${turnoActual.cajaInicial} Bs`,
      cajaFinal: `${cajaFinal} Bs`,
      totalVentas: `${totalVentas} Bs`,
      estadisticas: estadisticasDelDia
    });
    
    setModalSalidaConfirmacionVisible(true);
  };

  // Funciones de edición
  const confirmarEditarEntrada = () => {
    if (!editEntradaInput.trim()) {
      Alert.alert('Error', 'Por favor ingresa una hora válida');
      return;
    }

    setTurnoActual(prev => ({
      ...prev,
      horaEntrada: editEntradaInput
    }));

    setEditEntradaInput('');
    setModalEditEntradaVisible(false);
    Alert.alert('✅ Hora de entrada actualizada', `Nueva hora: ${editEntradaInput}`);
  };

  const confirmarEditarSalida = () => {
    if (!editSalidaInput.trim()) {
      Alert.alert('Error', 'Por favor ingresa una hora válida');
      return;
    }

    // Recalcular total de ventas si existe caja final
    const totalVentas = turnoActual.cajaFinal ? turnoActual.cajaFinal - (turnoActual.cajaInicial || 0) : turnoActual.totalVentas;

    setTurnoActual(prev => ({
      ...prev,
      horaSalida: editSalidaInput,
      totalVentas
    }));

    setEditSalidaInput('');
    setModalEditSalidaVisible(false);
    Alert.alert('✅ Hora de salida actualizada', `Nueva hora: ${editSalidaInput}`);
  };

  const confirmarEditarCajaInicial = () => {
    const nuevaCajaInicial = parseFloat(editCajaInicialInput);
    
    if (isNaN(nuevaCajaInicial) || nuevaCajaInicial < 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    // Recalcular total de ventas si existe caja final
    const totalVentas = turnoActual.cajaFinal ? turnoActual.cajaFinal - nuevaCajaInicial : undefined;

    setTurnoActual(prev => ({
      ...prev,
      cajaInicial: nuevaCajaInicial,
      totalVentas
    }));

    setEditCajaInicialInput('');
    setModalEditCajaInicialVisible(false);
    Alert.alert('✅ Caja inicial actualizada', `Nuevo monto: ${nuevaCajaInicial} Bs`);
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
    <View style={styles.containerNew}>
      {/* Header */}
      <View style={styles.headerNew}>
        <NavButton 
          style={styles.backBtnNew} 
          onPress={volverAtrasSeguro}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#64748b" />
        </NavButton>
        <Text style={styles.headerTitleNew}>Control de Turnos</Text>
        <NavButton 
          style={styles.historialBtnNew} 
          onPress={() => navegarSeguro('HistorialTurnos')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="history" size={24} color="#3B82F6" />
        </NavButton>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.mainContentNew}
        contentContainerStyle={styles.scrollContentContainerNew}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCenterNew}>
          {/* Clock Icon */}
          <View style={styles.iconContainerNew}>
            <MaterialCommunityIcons name="clock-outline" size={80} color="#2badee" />
          </View>
          
          {/* Title and Description */}
          <Text style={styles.mainTitleNew}>Registra tu turno</Text>
          <Text style={styles.descriptionNew}>
            {!turnoActual.horaEntrada 
              ? "Presiona el botón para marcar tu hora de entrada."
              : turnoEnCurso 
              ? "Tu turno está activo. Puedes registrar tu salida cuando termines."
              : "Turno completado. Puedes enviar el reporte al administrador."
            }
          </Text>
          
          {/* Date and Time Card */}
          <View style={styles.timeCardNew}>
            <Text style={styles.timeCardLabelNew}>Fecha y hora a registrar</Text>
            <Text style={styles.timeCardTimeNew}>{formatearHora(tiempoActual)}</Text>
            <Text style={styles.timeCardDateNew}>{formatearFecha(tiempoActual)}</Text>
          </View>

          {/* Turno Information Card */}
          {turnoActual.horaEntrada && (
            <View style={styles.turnoInfoCardNew}>
              <Text style={styles.turnoInfoTitleNew}>Información del Turno</Text>
              
              <View style={styles.turnoInfoRowNew}>
                <Text style={styles.turnoInfoLabelNew}>Hora de entrada:</Text>
                <View style={styles.turnoInfoValueContainerNew}>
                  <Text style={styles.turnoInfoValueNew}>{turnoActual.horaEntrada}</Text>
                  <TouchableOpacity 
                    style={styles.editButtonNew}
                    onPress={() => {
                      setEditEntradaInput(turnoActual.horaEntrada || '');
                      setModalEditEntradaVisible(true);
                    }}
                  >
                    <MaterialCommunityIcons name="pencil" size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.turnoInfoRowNew}>
                <Text style={styles.turnoInfoLabelNew}>Caja inicial:</Text>
                <View style={styles.turnoInfoValueContainerNew}>
                  <Text style={styles.turnoInfoValueNew}>{turnoActual.cajaInicial} Bs</Text>
                  <TouchableOpacity 
                    style={styles.editButtonNew}
                    onPress={() => {
                      setEditCajaInicialInput(turnoActual.cajaInicial?.toString() || '');
                      setModalEditCajaInicialVisible(true);
                    }}
                  >
                    <MaterialCommunityIcons name="pencil" size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              {turnoActual.horaSalida && (
                <View style={styles.turnoInfoRowNew}>
                  <Text style={styles.turnoInfoLabelNew}>Hora de salida:</Text>
                  <View style={styles.turnoInfoValueContainerNew}>
                    <Text style={styles.turnoInfoValueNew}>{turnoActual.horaSalida}</Text>
                    <TouchableOpacity 
                      style={styles.editButtonNew}
                      onPress={() => {
                        setEditSalidaInput(turnoActual.horaSalida || '');
                        setModalEditSalidaVisible(true);
                      }}
                    >
                      <MaterialCommunityIcons name="pencil" size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {turnoActual.cajaFinal && (
                <View style={styles.turnoInfoRowNew}>
                  <Text style={styles.turnoInfoLabelNew}>Caja final:</Text>
                  <Text style={styles.turnoInfoValueNew}>{turnoActual.cajaFinal} Bs</Text>
                </View>
              )}

              {turnoActual.totalVentas !== undefined && (
                <View style={[styles.turnoInfoRowNew, styles.totalVentasRowNew]}>
                  <Text style={styles.totalVentasLabelNew}>Total ventas:</Text>
                  <Text style={styles.totalVentasValueNew}>{turnoActual.totalVentas} Bs</Text>
                </View>
              )}
            </View>
          )}
          
          {/* Action Button */}
          {!turnoActual.horaEntrada && (
            <TouchableOpacity style={styles.primaryButtonGreen} onPress={handleRegistrarEntrada}>
              <Text style={styles.primaryButtonTextNew}>Registrar Entrada</Text>
            </TouchableOpacity>
          )}

          {turnoEnCurso && (
            <TouchableOpacity style={styles.primaryButtonRed} onPress={handleRegistrarSalida}>
              <Text style={styles.primaryButtonTextNew}>Registrar Salida</Text>
            </TouchableOpacity>
          )}

          {turnoCompletado && (
            <TouchableOpacity style={styles.primaryButtonNew} onPress={enviarReportePorWhatsApp}>
              <Text style={styles.primaryButtonTextNew}>Enviar Reporte</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavNew}>
        <TouchableOpacity style={styles.navItemNew} onPress={() => navigation.navigate('Dashboard')}>
          <MaterialCommunityIcons name="home" size={24} color="#64748b" />
          <Text style={styles.navLabelNew}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemNew} onPress={() => navigation.navigate('MisOrdenes')}>
          <MaterialCommunityIcons name="receipt" size={24} color="#64748b" />
          <Text style={styles.navLabelNew}>Órdenes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemNew}>
          <MaterialCommunityIcons name="currency-usd" size={24} color="#64748b" />
          <Text style={styles.navLabelNew}>Ingresos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActiveNew}>
          <View style={styles.profileIconContainerNew}>
            <MaterialCommunityIcons name="account-circle" size={24} color="#1e293b" />
            <View style={styles.activeDotNew} />
          </View>
          <Text style={styles.navLabelActiveNew}>Perfil</Text>
        </TouchableOpacity>
      </View>

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
              <MaterialCommunityIcons name="login" size={24} color="#059669" />
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
              <MaterialCommunityIcons name="logout" size={24} color="#DC2626" />
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

      {/* Modal editar entrada */}
      <Modal
        visible={modalEditEntradaVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalEditEntradaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="pencil" size={24} color="#2badee" />
              <Text style={styles.modalTitle}>Editar Hora de Entrada</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalLabel}>Nueva hora de entrada</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: 08:30"
                value={editEntradaInput}
                onChangeText={setEditEntradaInput}
                keyboardType="default"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setModalEditEntradaVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={confirmarEditarEntrada}
              >
                <Text style={styles.confirmBtnText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal editar salida */}
      <Modal
        visible={modalEditSalidaVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalEditSalidaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="pencil" size={24} color="#ef4444" />
              <Text style={styles.modalTitle}>Editar Hora de Salida</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalLabel}>Nueva hora de salida</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: 17:30"
                value={editSalidaInput}
                onChangeText={setEditSalidaInput}
                keyboardType="default"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setModalEditSalidaVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={confirmarEditarSalida}
              >
                <Text style={styles.confirmBtnText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal editar caja inicial */}
      <Modal
        visible={modalEditCajaInicialVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalEditCajaInicialVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="pencil" size={24} color="#10b981" />
              <Text style={styles.modalTitle}>Editar Caja Inicial</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalLabel}>Nuevo monto de caja inicial (Bs)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: 200.00"
                value={editCajaInicialInput}
                onChangeText={setEditCajaInicialInput}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setModalEditCajaInicialVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={confirmarEditarCajaInicial}
              >
                <Text style={styles.confirmBtnText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación Personalizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalConfirmacionVisible}
        onRequestClose={() => setModalConfirmacionVisible(false)}
      >
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationContainer}>
            {/* Icono de éxito */}
            <View style={styles.successIconContainer}>
              <MaterialCommunityIcons name="check-circle" size={60} color="#10B981" />
            </View>
            
            {/* Título */}
            <Text style={styles.confirmationTitle}>¡Entrada Registrada!</Text>
            
            {/* Información */}
            <View style={styles.confirmationInfo}>
              <View style={styles.confirmationRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#6B7280" />
                <Text style={styles.confirmationLabel}>Hora:</Text>
                <Text style={styles.confirmationValue}>{confirmacionData.hora}</Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <MaterialCommunityIcons name="cash" size={20} color="#6B7280" />
                <Text style={styles.confirmationLabel}>Caja inicial:</Text>
                <Text style={styles.confirmationValue}>{confirmacionData.caja}</Text>
              </View>
            </View>
            
            {/* Botón OK */}
            <TouchableOpacity
              style={styles.confirmationButton}
              onPress={() => setModalConfirmacionVisible(false)}
            >
              <Text style={styles.confirmationButtonText}>Perfecto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación de Salida */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSalidaConfirmacionVisible}
        onRequestClose={() => setModalSalidaConfirmacionVisible(false)}
      >
        <View style={styles.salidaOverlay}>
          <View style={styles.salidaContainer}>
            {/* Header con icono de éxito */}
            <View style={styles.salidaHeader}>
              <MaterialCommunityIcons name="trophy" size={50} color="#F59E0B" />
              <Text style={styles.salidaTitle}>¡Turno Completado!</Text>
              <Text style={styles.salidaSubtitle}>¡Excelente trabajo hoy! 🎉</Text>
            </View>

            <ScrollView style={styles.salidaContent} showsVerticalScrollIndicator={false}>
              {/* Resumen del turno */}
              <View style={styles.salidaSection}>
                <Text style={styles.salidaSectionTitle}>📅 Resumen del Turno</Text>
                
                <View style={styles.salidaRow}>
                  <MaterialCommunityIcons name="clock-in" size={20} color="#10B981" />
                  <Text style={styles.salidaLabel}>Entrada:</Text>
                  <Text style={styles.salidaValue}>{salidaData.entrada}</Text>
                </View>
                
                <View style={styles.salidaRow}>
                  <MaterialCommunityIcons name="clock-out" size={20} color="#EF4444" />
                  <Text style={styles.salidaLabel}>Salida:</Text>
                  <Text style={styles.salidaValue}>{salidaData.salida}</Text>
                </View>
                
                <View style={styles.salidaRow}>
                  <MaterialCommunityIcons name="cash" size={20} color="#3B82F6" />
                  <Text style={styles.salidaLabel}>Caja inicial:</Text>
                  <Text style={styles.salidaValue}>{salidaData.cajaInicial}</Text>
                </View>
                
                <View style={styles.salidaRow}>
                  <MaterialCommunityIcons name="cash-multiple" size={20} color="#10B981" />
                  <Text style={styles.salidaLabel}>Caja final:</Text>
                  <Text style={styles.salidaValue}>{salidaData.cajaFinal}</Text>
                </View>
                
                <View style={styles.salidaRow}>
                  <MaterialCommunityIcons name="trending-up" size={20} color="#F59E0B" />
                  <Text style={styles.salidaLabel}>Total ventas:</Text>
                  <Text style={styles.salidaValueHighlight}>{salidaData.totalVentas}</Text>
                </View>
              </View>

              {/* Estadísticas del día */}
              <View style={styles.salidaSection}>
                <Text style={styles.salidaSectionTitle}>📊 Estadísticas del Día</Text>
                
                <View style={styles.estadisticasGrid}>
                  <View style={styles.estadisticaCard}>
                    <MaterialCommunityIcons name="clipboard-list" size={24} color="#3B82F6" />
                    <Text style={styles.estadisticaNumero}>{salidaData.estadisticas.ordenesHoy}</Text>
                    <Text style={styles.estadisticaLabel}>Órdenes procesadas</Text>
                  </View>
                  
                  <View style={styles.estadisticaCard}>
                    <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
                    <Text style={styles.estadisticaNumero}>{salidaData.estadisticas.ordenesTerminadas}</Text>
                    <Text style={styles.estadisticaLabel}>Terminadas</Text>
                  </View>
                  
                  <View style={styles.estadisticaCard}>
                    <MaterialCommunityIcons name="account-group" size={24} color="#8B5CF6" />
                    <Text style={styles.estadisticaNumero}>{salidaData.estadisticas.clientesAtendidos}</Text>
                    <Text style={styles.estadisticaLabel}>Clientes</Text>
                  </View>
                  
                  <View style={styles.estadisticaCard}>
                    <MaterialCommunityIcons name="currency-usd" size={24} color="#F59E0B" />
                    <Text style={styles.estadisticaNumero}>${salidaData.estadisticas.ventasHoy}</Text>
                    <Text style={styles.estadisticaLabel}>Facturado</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.salidaActions}>
              <TouchableOpacity
                style={styles.salidaButtonSecondary}
                onPress={() => {
                  setModalSalidaConfirmacionVisible(false);
                  enviarReportePorWhatsApp();
                }}
              >
                <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" />
                <Text style={styles.salidaButtonSecondaryText}>Enviar Reporte</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.salidaButtonPrimary}
                onPress={() => setModalSalidaConfirmacionVisible(false)}
              >
                <Text style={styles.salidaButtonPrimaryText}>Cerrar</Text>
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
  // New Design Styles
  containerNew: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerNew: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backBtnNew: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historialBtnNew: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleNew: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: -32, // Compensate for back button and new button
  },
  mainContentNew: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContentContainerNew: {
    paddingTop: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  contentCenterNew: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconContainerNew: {
    marginBottom: 24,
  },
  mainTitleNew: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionNew: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  timeCardNew: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '100%',
  },
  timeCardLabelNew: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  timeCardTimeNew: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 40,
  },
  timeCardDateNew: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 4,
  },
  turnoInfoCardNew: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '100%',
  },
  turnoInfoTitleNew: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  turnoInfoRowNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  turnoInfoLabelNew: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  turnoInfoValueContainerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  turnoInfoValueNew: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  editButtonNew: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#f8fafc',
  },
  totalVentasRowNew: {
    borderBottomWidth: 0,
    paddingTop: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  totalVentasLabelNew: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '700',
  },
  totalVentasValueNew: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '700',
  },
  primaryButtonNew: {
    width: '100%',
    height: 56,
    backgroundColor: '#2badee',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonGreen: {
    width: '100%',
    height: 56,
    backgroundColor: '#10b981',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonRed: {
    width: '100%',
    height: 56,
    backgroundColor: '#ef4444',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonTextNew: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomNavNew: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  navItemNew: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navItemActiveNew: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabelNew: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  navLabelActiveNew: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  profileIconContainerNew: {
    position: 'relative',
  },
  activeDotNew: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2badee',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  // Estilos para el modal de confirmación
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 50,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationInfo: {
    width: '100%',
    marginBottom: 25,
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    marginBottom: 8,
  },
  confirmationLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 10,
    flex: 1,
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  confirmationButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmationButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Estilos para el modal de salida
  salidaOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  salidaContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
  },
  salidaHeader: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  salidaTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10,
    marginBottom: 5,
  },
  salidaSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  salidaContent: {
    flex: 1,
    paddingHorizontal: 25,
  },
  salidaSection: {
    marginVertical: 15,
  },
  salidaSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  salidaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
  },
  salidaLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  salidaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  salidaValueHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  estadisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  estadisticaCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  estadisticaNumero: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  estadisticaLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  salidaActions: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  salidaButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#25D366',
    gap: 8,
  },
  salidaButtonSecondaryText: {
    color: '#25D366',
    fontSize: 16,
    fontWeight: '600',
  },
  salidaButtonPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#3B82F6',
    borderRadius: 15,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  salidaButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
