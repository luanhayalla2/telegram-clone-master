import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
const App = require('./App').default;
registerRootComponent(App);
