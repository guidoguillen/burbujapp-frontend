import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';

export default function PrintLabel() {
  const [devices, setDevices] = useState([]);
  const [connected, setConnected] = useState(false);

  const scanAndConnect = async () => {
    try {
      const result = await BluetoothManager.scanDevices();
      const paired = result.paired || [];
      setDevices(paired);
      // Busca tu impresora NIIBOT B1 en la lista y conéctate
      const niibot = paired.find(d => d.name && d.name.includes('NIIBOT'));
      if (niibot) {
        await BluetoothManager.connect(niibot.address);
        setConnected(true);
      } else {
        alert('NIIBOT B1 no encontrada');
      }
    } catch (e) {
      alert('Error al escanear/conectar: ' + e.message);
    }
  };

  const printTestLabel = async () => {
    if (!connected) {
      alert('Conecta primero la impresora');
      return;
    }
    try {
      await BluetoothEscposPrinter.printText('Etiqueta de prueba\n\r', {});
    } catch (e) {
      alert('Error al imprimir: ' + e.message);
    }
  };

  return (
    <View>
      <Button title="Buscar y conectar NIIBOT B1" onPress={scanAndConnect} />
      <Button title="Imprimir etiqueta" onPress={printTestLabel} disabled={!connected} />
      <Text>Dispositivos encontrados: {devices.map(d => d.name).join(', ')}</Text>
    </View>
  );
}
