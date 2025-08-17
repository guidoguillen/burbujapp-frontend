import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

// Ejemplo de datos
const cliente = {
  nombre: 'Gabriela Molina',
  telefono: '+591 79954303',
};

const orden = {
  id: 'ORD-001',
  articulos: [
    { nombre: 'Camisa', cantidad: 2 },
    { nombre: 'Pantalón', cantidad: 1 },
  ],
};

export async function imprimirEtiquetaEjemplo() {
  // Título y QR
  await BluetoothEscposPrinter.printText('ORDEN: ' + orden.id + '\n', { fonttype: 2, widthtimes: 2, heigthtimes: 2 });
  await BluetoothEscposPrinter.printQRCode(orden.id, 200, 200, 0); // QR con el ID de la orden
  await BluetoothEscposPrinter.printText('\n', {});

  // Información del cliente
  await BluetoothEscposPrinter.printText('Cliente: ' + cliente.nombre + '\n', { fonttype: 1 });
  await BluetoothEscposPrinter.printText('Tel: ' + cliente.telefono + '\n', { fonttype: 1 });
  await BluetoothEscposPrinter.printText('\n', {});

  // Artículos
  await BluetoothEscposPrinter.printText('Artículos:\n', { fonttype: 1 });
  for (const art of orden.articulos) {
    await BluetoothEscposPrinter.printText(`- ${art.nombre} x${art.cantidad}\n`, { fonttype: 1 });
  }
  await BluetoothEscposPrinter.printText('\n', {});
}
