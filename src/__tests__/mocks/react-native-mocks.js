// Mocks de React Native y Expo para Jest
const React = require('react');
const ReactNative = require('react-native');

// Mock de Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = ReactNative;
  
  return {
    MaterialCommunityIcons: (props) => React.createElement(Text, { 
      ...props, 
      testID: `icon-${props.name}` 
    }, props.name),
    Ionicons: (props) => React.createElement(Text, { 
      ...props, 
      testID: `icon-${props.name}` 
    }, props.name),
    FontAwesome: (props) => React.createElement(Text, { 
      ...props, 
      testID: `icon-${props.name}` 
    }, props.name),
  };
});

// Mock de React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    dispatch: jest.fn(),
    canGoBack: jest.fn(() => true),
    isFocused: jest.fn(() => true),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
  useRoute: () => ({
    key: 'test-route',
    name: 'TestScreen',
    params: {},
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
  NavigationContainer: ({ children }) => children,
  createNavigationContainerRef: () => ({
    current: {
      navigate: jest.fn(),
      goBack: jest.fn(),
    },
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
  CardStyleInterpolators: {
    forHorizontalIOS: {},
  },
}));

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock de react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock de QR Code
jest.mock('react-native-qrcode-svg', () => 'QRCode');

// Mock de ViewShot
jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(() => Promise.resolve('mock-uri')),
  captureScreen: jest.fn(() => Promise.resolve('mock-uri')),
}));

// Mock de File System (Expo)
jest.mock('expo-file-system', () => ({
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  readAsStringAsync: jest.fn(() => Promise.resolve('')),
  deleteAsync: jest.fn(() => Promise.resolve()),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true })),
  documentDirectory: 'file://mock-document-directory/',
  cacheDirectory: 'file://mock-cache-directory/',
}));

// Mock de Date Time Picker
jest.mock('@react-native-community/datetimepicker', () => ({
  DateTimePicker: 'DateTimePicker',
}));

// Mock de react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  ScrollView: 'ScrollView',
  FlatList: 'FlatList',
  State: {},
  PanGestureHandler: 'PanGestureHandler',
  BaseButton: 'BaseButton',
  RectButton: 'RectButton',
  BorderlessButton: 'BorderlessButton',
  gestureHandlerRootHOC: jest.fn((component) => component),
}));

// Mock global de fetch
global.fetch = jest.fn();

module.exports = {};
