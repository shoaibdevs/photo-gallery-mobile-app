import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import store from '../redux/store'
import { setPushAlert, setRouteFromNotification } from '../redux'
import { NavigationActions, StackActions } from 'react-navigation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Alert, Platform } from 'react-native'
let isAlbumEmptyData = null

PushNotification.configure({
  onNotification: function (notification) {
    const { data, message, channelId, messageId } = notification;
    console.log("data ---->", notification);
    // console.log(message, 'message');
    // console.log(channelId, 'channelId');
    // console.log(messageId, 'messageId');
    // const {user} = store.getState()
    // console.log(user,'user');
    // console.log(store.getState(), 'storestorestorestore');
    // console.log(user.isAlbumEmpty,'isAlbumEmptyisAlbumEmptyisAlbumEmpty');
    // console.log(isAlbumEmptyData,'datadatadata');
    // console.log((message != undefined && message?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש') && channelId === '1'), 'left part');
    // console.log(message,'message');
    // console.log(message?.split(' ')?.join(''),'message?.split()?.join()');
    // console.log(message?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש'),'message?.split()?.join()?.includes(');
    // console.log((data?.body?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש') &&notification?.data?.collapse_key ), 'right part');
    // console.log(data?.body?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש'),'message?.split()?.join()?.includes(');
    // console.log(data?.body?.split(' ')?.join(''), 'data?.body?.split()?.join()');
    // console.log(notification?.data?.collapse_key,'notification?.data?.collapse_key');
    // console.log(notification, 'notificationnotification');
    if ((message != undefined && message?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש')) || (notification?.data?.body?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש'))) {
      isAlbumEmptyData = notification?.data?.emptyAlbum
      if (isAlbumEmptyData === '1') {
        store.dispatch(setRouteFromNotification('gallery'))
        console.log('i am near redirect ');
        global.stackNavigator.dispatch(
          StackActions.push({
            routeName: 'ChooseImages',
            params: {
              chosenPictureStartScreen: '2',
              pictures: [],
              trigerUseeffect: true
            }
          })
        )
      } else {
        global.stackNavigator.dispatch(
          StackActions.push({
            routeName: 'drawerStack',
            params: {
              screen: 'Camera'
            }
          })
        )
      }
    }

    if ((message?.split(' ')?.join('')?.includes("תפסואתהרגע-הזמינואתהאלבום") && channelId === '1') || (data?.body?.split(' ')?.join('')?.includes("תפסואתהרגע-הזמינואתהאלבום"))) {
      console.log("here");
      store.dispatch(setRouteFromNotification('album'))
      global.stackNavigator.dispatch(
        NavigationActions.navigate({
          routeName: 'MyAlbums'
        })
      )
    }
  }
});

const onLocalNotification = (notification) => {
  isAlbumEmptyData = notification?._data?.emptyAlbum
  if ((notification?._data?.body?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש'))) {
    if (isAlbumEmptyData === '1') {
      store.dispatch(setRouteFromNotification('gallery'))
      console.log('noptEmpty');
      global.stackNavigator.dispatch(
        StackActions.push({
          routeName: 'ChooseImages',
          params: {
            chosenPictureStartScreen: '2',
            pictures: [],
            trigerUseeffect: true
          }
        })
      )
    } else {
      global.stackNavigator.dispatch(
        StackActions.push({
          routeName: 'drawerStack',
          params: {
            screen: 'Camera'
          }
        })
      )
    }
  }

  if ((notification?._data.body.split(' ')?.join('')?.includes("תפסואתהרגע-הזמינואתהאלבום") && notification?._data.channelId === '1') && notification?.data?.collapse_key) {
    store.dispatch(setRouteFromNotification('album'))
    global.stackNavigator.dispatch(
      NavigationActions.navigate({
        routeName: 'MyAlbums'
      })
    )
  }
};

export const listenerForCloseApp = () => {

  console.log("here ----->");
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    return Promise.resolve();
  });
}


const onRegistered = (deviceToken) => {
  console.log("device token", deviceToken);
};

const onRemoteNotification = (notification) => {
  console.log("IS Clicked", notification);
};

const onRegistrationError = (error) => {
  console.log(error);
};

export const initPushNotifications = () => {


  if (Platform.OS == 'ios') {

    PushNotification.popInitialNotification(notification => {
      console.log("Notf", notification);

      isAlbumEmptyData = notification?.data?.emptyAlbum
      if (notification != undefined) {
        if ((notification?.data?.body?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש'))) {
          if (isAlbumEmptyData === '1') {
            store.dispatch(setRouteFromNotification('gallery'))
            console.log('noptEmpty');
            global.stackNavigator.dispatch(
              StackActions.push({
                routeName: 'ChooseImages',
                params: {
                  chosenPictureStartScreen: '2',
                  pictures: [],
                  trigerUseeffect: true
                }
              })
            )
          }
        } else {
          global.stackNavigator.dispatch(
            StackActions.push({
              routeName: 'drawerStack',
              params: {
                screen: 'Camera'
              }
            })
          )
        }
        if ((notification?.data?.channelId === '1') || (notification?.data?.body.split(' ')?.join('')?.includes("תפסואתהרגע-הזמינואתהאלבום") && notification?.data?.collapse_key)) {
          store.dispatch(setRouteFromNotification('album'))
          global.stackNavigator.dispatch(
            NavigationActions.navigate({
              routeName: 'MyAlbums'
            })
          )
        }
      }

    });

    PushNotificationIOS.addEventListener('register', onRegistered);
    PushNotificationIOS.addEventListener(
      'registrationError',
      onRegistrationError,
    );
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener(
      'localNotification',
      onLocalNotification,
    );

    PushNotificationIOS.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
      critical: true,
    }).then(
      (data) => {
        console.log('PushNotificationIOS.requestPermissions', data);
      },
      (data) => {
        console.log('PushNotificationIOS.requestPermissions failed', data);
      },
    );

    return () => {
      PushNotificationIOS.removeEventListener('register');
      PushNotificationIOS.removeEventListener('registrationError');
      PushNotificationIOS.removeEventListener('notification');
      PushNotificationIOS.removeEventListener('localNotification');
    };
  }
}
