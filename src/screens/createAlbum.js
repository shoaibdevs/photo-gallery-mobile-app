import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Dimensions, TouchableOpacity, BackHandler, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { VerticalSpace } from '../utilities/verticalSpace'
import Button from '../utilities/button'
import { colors } from '../colors'
import { saveImg, getCounter } from '../api'
import { newAblumData, saveImgData } from '../helpers/albumHelper';
import { useSelector, useDispatch } from 'react-redux'
import PopupContacts from './popups/popupContacts'
import { setPopupContacts, setPopupExitFromAlbumSettings, setPopupNewAlbumCreated, setPopupError } from '../redux'
import moment from 'moment'
import PopupAlbumCreated from './popups/popupAlbumCreated';
import PopupError from './popups/popupError';
import PopupExitFromAlbumSettings from './popups/popupExitFromAlbumSettings'
import AnimatedLoader from "react-native-animated-loader";
import { BlurView } from "@react-native-community/blur";
import Modal from 'react-native-modal';
import Contacts from 'react-native-contacts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function UseGuide({ navigation }) {
  const { popupContacts, user, allSharedPictures, pictures, popupExitFromAlbumSettings,
     popupNewAlbumCreated } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [savePhoto, setSavePhoto] = useState(false)
  const [sharedTo, setSharedTo] = useState([])
  const [albumName, setAlbumName] = useState('')
  const [isNameFieldEmpty, setIsNameFieldEmpty] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permission, setPermission] = useState('')

  const today = moment().format('DD-MM-YYYY HH:mm:ss');
  const monthAhead = moment().add(1, 'months').format('DD-MM-YYYY HH:mm:ss')

  useEffect(() => {
    setSavePhoto(false)

    if (isNameFieldEmpty) {
      setIsNameFieldEmpty(false)
    }
  }, [albumName,])
  const [data, setData] = useState([])

  useEffect(() => {
    if(data?.length == 0){
      getCounter().then(res => {
          console.log("Counter res 8 ->", res)
          setData(res)})
  }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove();
  }, [data])

  const createNewAlbum = async () => {
    if (albumName.length > 0) {
      let sharedNumbers = '';
      if (sharedTo.length > 0) {

        sharedTo.map(phone => {
          const numberArr = phone.phoneNumbers.reduce((formatedNumbersArr, number) => {
            let formateNumber = number.number.replace(/[()/+ -]+/g, "")

            if (formateNumber.length > 12) {
              formateNumber = formateNumber.slice(formateNumber.length - 12)
            }

            formateNumber = formateNumber.split('')

            if (formateNumber[0] === '9' && formateNumber[1] === '7' && formateNumber[2] === '2') {
              formateNumber.shift()
              formateNumber.shift()
              formateNumber.shift()
            }
            formateNumber = formateNumber.join('')

            if (formatedNumbersArr.length === 0) {
              return [formateNumber]
            }

            const isNumberInArr = formatedNumbersArr.findIndex(num => num === number)

            if (isNumberInArr !== -1) {
              return [...formateNumber, formateNumber]
            }

            return [...formatedNumbersArr]
          }, [])

          sharedNumbers += numberArr.map(number => number).join(',') + ',';
        })

        sharedNumbers = sharedNumbers.replace(/[()/+ -]+/g, "").trim().slice(0, -1)
      }

      const isItemToUploadIntoNewAlbum = navigation?.state?.params?.item ? true : false
      setLoading(true)
      setSavePhoto(false)

      const formData = new FormData()
      formData.append('token', user.token)
      formData.append('albume_name', albumName)
      formData.append('max_images', data ? data[0].value : '10' )
      // formData.append('max_images', '201')
      // formData.append('max_images', '18')
      formData.append('shared_to', sharedNumbers)
      formData.append('status', '2')
      formData.append('date_created', today)

      formData.append('deadline', monthAhead)
      formData.append('isImage', isItemToUploadIntoNewAlbum ? "1" : '0')
      // console.log(formData);
      const response = await newAblumData(formData);
        console.log(response);
        console.log("sent", navigation.state.params);
        if (navigation.state.params != undefined)
          if (navigation?.state?.params?.item !== null && navigation?.state?.params?.item !== undefined) {
            const formData = new FormData()
            formData.append('token', user.token)
            formData.append('album_id', response)
            formData.append('images[]', navigation.state.params.item)
            console.log('----- Image Terminator -----', response)
            saveImgData(formData).then((res) => {
              console.log("save image", res);
              setSavePhoto(true)
              setLoading(false)
              dispatch(setPopupNewAlbumCreated(true))
            }).catch(err => {
              dispatch(setPopupError(true))
              setLoading(false)
            })
            navigation.setParams({ item: null })
          }

      if (!isItemToUploadIntoNewAlbum) {
        setSavePhoto(false)
        dispatch(setPopupNewAlbumCreated(true))
        setLoading(false)
      }
    } else {
      setIsNameFieldEmpty(true)
    }
  }

  return (
    <>
      <AnimatedLoader //++
        visible={loading}
        overlayColor="rgba(255,255,255,0.75)"
        source={require("../../assets/picitLoader.json")}
        animationStyle={{ width: 100, height: 100 }}
        speed={1}
      ></AnimatedLoader>
      <TouchableWithoutFeedback style={{ height: '100%' }} onPress={() => { Keyboard.dismiss(); console.log('clicked'); }}>
        <View style={styles.container}>
          <Image style={{ backgroundColor: colors.white, width: width, }} source={require('../../assets/images/imgBackgroundCover.png')} />
          <View style={{ alignItems: 'center', bottom: 100, width: '85%', alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row-reverse', alignSelf: 'flex-end', bottom: 60, backgroundColor: colors.white }}>
              <TouchableOpacity onPress={() => {
                dispatch(setPopupExitFromAlbumSettings(true))
                setAlbumName('')
                setSharedTo([])
                
                }} style={{ alignSelf: 'flex-end' }} >
                <Image source={require('../../assets/images/buttonsNavBar.png')} />
              </TouchableOpacity>
              <Text style={styles.cardText}>{'יצירת אלבום חדש'}</Text>
            </View>

            <View style={[styles.SectionStyle, { bottom: 20, borderColor: isFocused ? colors.secondary : isNameFieldEmpty ? colors.red : colors.textInputBorder }]}>
              <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 15, textAlign: 'center', color: isFocused ? colors.secondary : colors.length, left: 100 }]}>{`${albumName.length}/36`}</Text>
              <TextInput
                maxLength={45}
                placeholderTextColor={colors.black}
                style={{ fontFamily: 'Arimo-Regular', paddingRight: 10, width: width }}
                textAlign={'right'}
                placeholder={'שם האלבום'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={albumName}
                onChangeText={txt => setAlbumName(txt)}
              />
              {isNameFieldEmpty ? <Text style={styles.errorText}>{'יש לתת שם לאלבום'}</Text> : null}
            </View>

            <VerticalSpace height={0.0070} />
            <View style={styles.line} />
            <VerticalSpace height={0.03} />

            <View style={{ backgroundColor: colors.card, width: '100%' }}>
              <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right', color: colors.text }}>{'שותפים לאלבום'}</Text>
              <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, marginTop: 14, textAlign: 'right', color: colors.purpleGrey }}>{`באפשרותך לשתף חברים שיוכלו להוסיף תמונות ${'\n'}לאלבום המשותף`}</Text>
              <VerticalSpace height={0.03} />

              <TouchableOpacity onPress={() => dispatch(setPopupContacts(true))} style={styles.SectionStyle}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  < View style={{ flexDirection: 'row-reverse', alignItems: 'center', left: 5 }}>
                    <Image style={{ width: 24, height: 24 }} source={require('../../assets/images/iconsUserCopy.png')} />
                    <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, textAlign: 'right', color: colors.text, left: 5 }}>{sharedTo.length == 0 ? `לא נוספו שותפים (פרטי)` : `${sharedTo.length} שותפים`}</Text>
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, textAlign: 'left', color: colors.register, left: 5 }}>{'הוספה / הסרה'}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <VerticalSpace height={0.05} />
              <TouchableOpacity onPress={createNewAlbum} style={[styles.save]}>
                <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'center' }}>{'יצירת אלבום'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <PopupError />
          <PopupExitFromAlbumSettings navigation={navigation} popupExitFromAlbumSettings={popupExitFromAlbumSettings} />
      <PopupContacts popupContacts={popupContacts} navigation={navigation} setSharedTo={setSharedTo} sharedTo={sharedTo} cutNumbers={false} />
          <PopupAlbumCreated
            navigation={navigation}
            photoFromGallery={navigation.state.params?.photoFromGallery}
            allSharedPictures={allSharedPictures}
            pictures={pictures}
            setAlbumName={setAlbumName}
            setSharedTo={setSharedTo}
            albumName={albumName}
            chosenPic= {navigation.state.params != undefined ? navigation.state.params.chosenPic : null}
            deletePhoto={() => navigation.state.params != undefined ? navigation.state.params.deleteChosenPhoto() : null}
            savedPhoto={savePhoto}
          // popupNewAlbumCreated={popupNewAlbumCreated}
          />

        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    height: height,
  },
  cardText: {
    fontFamily: 'Arimo-Regular',
    fontSize: 17,
    alignSelf: 'center',
    left: width * 0.19
  },
  line: {
    alignSelf: 'center',
    borderWidth: 0.5,
    width: width * 0.85,
    borderColor: 'rgba(223,225,240,0.5)',
  },
  largeImage: {
    width: '100%',
    height: "50%"
  },
  card: {
    height: 197,
    backgroundColor: colors.card,
    borderRadius: 50
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    // borderColor: colors.textInputBorder,
    height: 56,
    backgroundColor: colors.white,
    borderRadius: 6,
    color: colors.black,
  },
  save: {
    backgroundColor: colors.nextButton,
    height: 55,
    width: width * 0.5,
    borderRadius: 26,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.red,
    position: 'absolute',
    fontFamily: 'Arimo-Regular',
    bottom: -20
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12
  },

  blurView: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(159,156,165,0.3)',
    flex: 1,
    width: width,
    height: height
  },
  background: {
    elevation: 3,
    borderRadius: 50,
    width: '100%',
    height: 229,
    backgroundColor: colors.white,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 15
  },
  buttonCardText: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Arimo-Regular',
  },
  modal: {
    width: '100%',
    top: 20,
    justifyContent: 'center',
    flex: 1,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

