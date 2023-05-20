/**
 * @format
 */
import { AppRegistry, I18nManager } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { listenerForCloseApp } from './src/services/NotificationService';

// listener for close app notifications
  listenerForCloseApp();

try {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
} catch (e) {
  console.log('allowsRTL', e);
}
AppRegistry.registerComponent(appName, () => App);




