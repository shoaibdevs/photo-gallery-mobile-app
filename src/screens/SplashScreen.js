import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, ImageBackground, Platform } from 'react-native';
import { colors } from '../colors'
import { VerticalSpace } from '../utilities/verticalSpace'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from '../api'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../redux'
import { StackActions, NavigationActions } from 'react-navigation'
import PushNotification from 'react-native-push-notification'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Splash({ navigation }) {

  const { pictures, user, routeFromNotification } = useSelector(state => state.user) //++
  const dispatch = useDispatch()

  useEffect(() => {
    checkForToken()
  }, [])

  const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [
      NavigationActions.navigate({ routeName: 'Signin' }),
    ],
  });

  checkForToken = async () => {

    let temp = ""
    PushNotification.popInitialNotification(notification => {
      console.log("checkForToken Notif", notification);
      if (notification != undefined) {
        isAlbumEmptyData = notification?.data?.emptyAlbum
        if ((notification?.data?.body?.split(' ')?.join('')?.includes('שותףאיתךאלבוםחדש'))) {
          if (isAlbumEmptyData === '1') {
            temp = 'gallery'
          }
        } else if ((notification?.data?.body?.split(' ')?.join('')?.includes("תפסואתהרגע-הזמינואתהאלבום"))) {
          temp = 'album'
        }

      }
    })


    const userInfoString = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoString);
    const walked = await AsyncStorage.getItem('walkedThrough')
    console.log("userInfo -->", userInfo);
    if (walked === 'yes' && userInfo === null) {
      dispatch(setUser(userInfo))
      navigation.dispatch(resetAction)
      return
    }
    if (userInfo != null) {
      dispatch(setUser(userInfo))
      
      const formData = new FormData()
      formData.append('token', userInfo.token)
      validateToken(formData).then(data => {
        console.log("Dataa token ---->", data);
        if (data.data != null) {
          if (temp === 'gallery') {
            const wait = time => new Promise((resolve) => setTimeout(resolve, time));
            return wait(2000).then(() => { navigation.navigate('ChooseImages', { chosenPictureStartScreen: '2', pictures: [], trigerUseeffect: true }) })
          } else if (temp === 'album') {
            const wait = time => new Promise((resolve) => setTimeout(resolve, time));
            return wait(2000).then(() => { navigation.navigate('MyAlbums') })
          } else {
            const wait = time => new Promise((resolve) => setTimeout(resolve, time));
            return wait(2000).then(() => { navigation.navigate('Camera') })
          }
        }
        else {
          const wait = time => new Promise((resolve) => setTimeout(resolve, time));
          return wait(2000).then(() => { navigation.navigate('Camera') })
          // return wait(2000).then(() => { navigation.navigate('Walkthrough') })
        }
      })
    } else {
      const wait = time => new Promise((resolve) => setTimeout(resolve, time));
      return wait(2000).then(() => { navigation.navigate('Walkthrough') })
    }

  }

  return (
    <ImageBackground source={require('../../assets/images/img-background-launch.png')} style={styles.container}>
      <View style={{ top: 163 }}>
        <Image style={styles.picit} source={require('../../assets/images/branding-logo-picit.png')} />
        <VerticalSpace height={0.03} />
        <Text style={styles.splashText}>{'פשוט לתפוס את הרגע'}</Text>
      </View>
      {/* <Image source={require('../../assets/images/beta.png')} style={{ width: 51, height: 18, alignSelf:'center', position:'absolute', bottom:76}} /> */}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.splashBackground
  },
  picit: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 167,
    height: 216
  },
  splashText: {
    fontFamily: 'Arimo-Bold',
    fontSize: 17
  }
});