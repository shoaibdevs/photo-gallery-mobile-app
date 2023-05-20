/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import AppNav from './src/navigation';
import { Provider } from 'react-redux';
import store from './src/redux/store'
import {I18nManager, Platform, LogBox, Button} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initPushNotifications} from './src/services/NotificationService';
import { setPushToken } from './src/redux';



LogBox.ignoreLogs([
  'Require cycle:',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'VirtualizedLists should never be nested inside plain ScrollView',
  'source.uri should not be an empty string'
])


const App: () => React$Node = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
     return await messaging().getToken()
  }

  useEffect(async () => {
    await requestUserPermission();
    getToken().then(async (token) => {
      console.log('push token', token)
      try {
        await AsyncStorage.setItem('push_token', token)
        store.dispatch(setPushToken(token))
      } catch (e) {
        console.log('async storage setItem error', e)
      }
    })
    initPushNotifications()
  }, [])

  const prefix = 'picit://';

  return (
    <Provider store={store}>
      <AppNav uriPrefix={prefix} ref={reference => global.stackNavigator = reference} />
    </Provider>
  );
};




export default App;
