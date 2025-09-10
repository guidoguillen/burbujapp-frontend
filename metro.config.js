const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración para manejar el warning de expo-notifications en Expo Go
if (process.env.NODE_ENV === 'development') {
  // Suprimir warnings específicos en desarrollo
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    if (
      message.includes('expo-notifications') && 
      message.includes('removed from Expo Go') &&
      message.includes('SDK 53')
    ) {
      // Suprimir warning conocido
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

module.exports = config;
