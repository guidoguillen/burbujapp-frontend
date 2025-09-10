/**
 * Polyfill para suprimir warnings conocidos
 * Se carga antes que cualquier otra importación
 */

// Suprimir warning específico de expo-notifications
const originalWarn = console.warn;
console.warn = function(...args) {
  const message = args.join(' ');
  
  // Lista de warnings que queremos suprimir
  const suppressedWarnings = [
    'expo-notifications: Android Push notifications',
    'removed from Expo Go with the release of SDK 53',
    'functionality provided by expo-notifications was removed'
  ];
  
  // Verificar si el mensaje contiene alguno de los warnings a suprimir
  const shouldSuppress = suppressedWarnings.some(warning => 
    message.includes(warning)
  );
  
  if (shouldSuppress) {
    // Opcional: log que suprimimos el warning
    if (__DEV__) {
      console.log('ℹ️  Warning suprimido: expo-notifications no disponible en Expo Go (SDK 53+)');
    }
    return;
  }
  
  // Para otros warnings, comportamiento normal
  originalWarn.apply(console, args);
};

// Suprimir también console.error para este caso específico
const originalError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  
  if (message.includes('expo-notifications') && message.includes('SDK 53')) {
    // Convertir error en log informativo
    if (__DEV__) {
      console.log('ℹ️  Info: expo-notifications requiere development build en SDK 53+');
    }
    return;
  }
  
  originalError.apply(console, args);
};

export default {};
