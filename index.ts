// Importar polyfill para suprimir warnings conocidos
import './src/polyfills/suppressWarnings';

import { registerRootComponent } from 'expo';

// Suprimir warning específico de expo-notifications en Expo Go
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(' ');
  if (
    message.includes('expo-notifications') && 
    message.includes('removed from Expo Go') &&
    message.includes('SDK 53')
  ) {
    // Suprimir este warning específico - es conocido y esperado
    return;
  }
  originalWarn.apply(console, args);
};

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
