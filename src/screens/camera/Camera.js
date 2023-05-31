
import { RNCamera } from 'react-native-camera';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, PermissionsAndroid, Animated,Dimensions, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../colors';
import { VerticalSpace } from '../../utilities/verticalSpace'
import { useSelector, useDispatch } from 'react-redux'
import { addPic, setPopupError, setSharedPhotos, setPics, setCountReadyForOrderAlbums } from '../../redux'
import CameraRoll from "@react-native-community/cameraroll"
import ImageResizer from 'react-native-image-resizer';
// import ImageEditor from "@react-native-community/imageeditor"

// import { ImageEditor } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchAlbums, getAllSharedImages, fetchCameraResoultion } from '../../api'
import { _getPics, _addPict } from '../../helpers/albumHelper';
import { isIphoneX } from 'react-native-iphone-x-helper';
import PopupError from '../popups/popupError';
import moment from 'moment'
import PopupCameraPermission from '../popups/popupCameraPermission';
import { PERMISSIONS, check, request, openSettings } from 'react-native-permissions'
import RNExitApp from 'react-native-exit-app';
import Sound from 'react-native-sound';
const { width, height } = Dimensions.get('window');
import RNFS from 'react-native-fs';
export default function Camera({ navigation }) {
    const cameraRef = useRef(null)
    const dispatch = useDispatch()
    const { pictures, user, allSharedPictures } = useSelector(state => state.user)
    const [count, setCount] = useState(0)
    const [sawInfo, setSawInfo] = useState('')
    const [firstPicture, setFirstPicture] = useState('')
    const [permissionGranted, setPermissionGranted] = useState(false)

    const [countAllPicturesAndSharedPhotos, setCountAllPicturesAndSharedPhotos] = useState(0)

    const [flipCamera, setFlipCamera] = useState(true) // true - back, false - front
    const [flash, setFlash] = useState(false) // true - on, false - off
    const today = moment().format("YYYY-MM-DD HH:MM:SS");

    const [cameraResolution, setCameraResolution] = useState(false)

    if(pictures.length == 0 )
        getPicts();

    const checkCameraPermission = async () => {
        
        if (Platform.OS == 'ios') {
            const res = await check(PERMISSIONS.IOS.CAMERA);
            console.log("Res ===>", res);
            // if (res == 'blocked')
                // setPermissionGranted(true)
        }
        if (Platform.OS == "android") {
            const permissionAndroid = await PermissionsAndroid.check('android.permission.CAMERA');
            console.log(permissionAndroid);
            if (!permissionAndroid) {
                setPermissionGranted(true)

            }
        }
    }
    const saveImageWithCustomResolution = async (imageUri, targetWidth, targetHeight) => {
        try {
            const resizedImage = await ImageResizer.createResizedImage(
                imageUri,
                targetWidth,
                targetHeight,
                'JPEG',
                100
              );
          
          await CameraRoll.save(resizedImage.uri, { type: 'photo', album: 'Pic.it' });
      
          console.log('Image saved successfully with custom resolution!');
        } catch (error) {
          console.log('Error saving image with custom resolution:', error);
        }
      };


    useEffect(() => {
        console.log("here -----< UseEffect ", user.token);
        AsyncStorage.getItem('sawInfo').then(res => setSawInfo(res))

        getAllSharedImages(user.token)
            .then(res => {
                if (res != 0) {
                    dispatch(setSharedPhotos(res.data));
                } else {
                    dispatch(setPopupError(true))
                }
            }).catch(err => dispatch(setPopupError(true)))
        // checkCameraPermission()
        fetchAlbums(user.token).then(response => {
            if (response != 0) {
                const countAlbusReadyForOrder = response?.data.filter(album => album.status === '1' && album.isAlbumLocked == '0').length
                dispatch(setCountReadyForOrderAlbums(countAlbusReadyForOrder))
            } else {
                dispatch(setPopupError(true))
            }
        }).catch(err => console.log(err))

        fetchCameraResoultion().then((res) => {
            console.log('Image resoultion called', res.resolution[0])
            setCameraResolution(res.resolution[0])
        }).catch(err =>{
            
        })
    }, [])

    // useLayoutEffect(() => {
    //     AsyncStorage.getItem('sawInfo').then(res => setSawInfo(res))

    //     getAllSharedImages(user.token)
    //         .then(res => {
    //             if (res != 0) {
    //                 dispatch(setSharedPhotos(res.data));
    //             } else {
    //                 dispatch(setPopupError(true))
    //             }
    //         }).catch(err => dispatch(setPopupError(true)))
    // }, [])

    // async function check(){
    //     console.log('yes check')
    // }

    // async function _setPics(){
    //     const cameraRollPicsString = await AsyncStorage.getItem('cameraRollPics');
    //     const cameraRollPics = JSON.parse(cameraRollPicsString);
    //     let array = cameraRollPics;
    //     console.log('check', pictures.length)
    //     dispatch(setPics([...array]))
    // }

    async function getPicts(){
        const _picts = await _getPics();
        // console.log('checking data',_picts);
        if(_picts != null && _picts.length > 0)
            dispatch(setPics([..._picts]));
    }
    const blinkOpacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (navigation.isFocused()) {
            let url = ''
            setCount(pictures.length)
            

            // getAllSharedImages(user.token).then(res => {
            //     dispatch(setSharedPhotos(res.data))
            // })
            setCountAllPicturesAndSharedPhotos(allSharedPictures?.length + pictures?.length)
            if (pictures?.length == 0) {
                setFirstPicture(allSharedPictures[0]?.photo)
                url = allSharedPictures[0]?.photo
            } else if (allSharedPictures?.length == 0) {
                setFirstPicture(pictures[0].uri)
                url = pictures[0].uri
            } else if (allSharedPictures?.length == 0 && pictures?.length == 0) {
                setFirstPicture('')
            } else {
                setFirstPicture(pictures[0].uri)
            }
        }
    }, [pictures.length, allSharedPictures.length, navigation.isFocused(), firstPicture, navigation.state.params?.refreshPage])
    const cameraSound = new Sound(require('../../../assets/sound/camera-shutter.mp3'), Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Error loading sound: ', error);
        }
      });
    const takePicture = async () => {
        if (cameraRef) {
            const defaultV = "480x360";
            const [width, height] = cameraResolution ? cameraResolution.name.split("x").map(Number) : defaultV.split("x").map(Number);
            let _date = new Date();
            const options = { quality: 0.5, base64: false, width: 1600 };
            const data = await cameraRef.current.takePictureAsync(options);
            const fileUri = data.uri;
            let _date_ = new Date();
            Animated.timing(blinkOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }).start(() => {
                cameraSound.play();
                // Stop the blink animation
                Animated.timing(blinkOpacity, {
                  toValue: 1,
                  duration: 0,
                  useNativeDriver: true,
                }).start();
              });
            try {
                if (Platform.OS == 'android') {
                    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log(data.uri);
                        // CameraRoll.save(data.uri, { type: 'photo', album: 'Pic.it' }).catch((error) => {
                        //     console.log("error permission:", error);
                        // });
                        await saveImageWithCustomResolution(data.uri, width, height);
                    } else {
                        console.log("Photos permission denied")
                    }
                }
                else {
                    // CameraRoll.save(data.uri, { type: 'photo', album: 'Pic.it' }).catch((error) => {
                    //     console.log("error camera roll:", error);
                    // });
                    await saveImageWithCustomResolution(data.uri, width, height);
                }

            } catch (err) {
                console.log("erro",err)
            }
            const resizedImage = await ImageResizer.createResizedImage(
                data.uri,
                width,
                height,
                'JPEG',
                100
              );
            const pic = {
                uri: resizedImage.uri,
                type: 'image/jpg',
                name: pictures.length + 1 + '.jpg'
            }
            _addPict(pic);
            dispatch(addPic(pic))
            setCount(count + 1)
            console.log("diff ", _date_ -_date)

            
        }
    };
    
    const renderGrid = () => {
        const grid = [
            [

            ]
        ];
        let row1 = []
        row1.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderTopWidth:0,
            borderBottomWidth:0,

            borderLeftWidth:0

        }} key={`${1}_${1}`} />)
        row1.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderBottomWidth:0,

            borderTopWidth:0,
        }} key={`${1}_${2}`} />)
        row1.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderTopWidth:0,
            borderBottomColor:'#FFFFFF',
            borderBottomWidth:0,
            borderRightWidth:0,
        }} key={`${1}_${3}`} />)
        
        let row2 = []
        row2.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderLeftWidth:0

        }} key={`${2}_${1}`} />)
        row2.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
        }} key={`${2}_${2}`} />)
        row2.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderRightWidth:0,

        }} key={`${2}_${3}`} />)
        let row3 = []
        row3.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderTopWidth:0,
            borderBottomWidth:0,
            borderLeftWidth:0
        }} key={`${3}_${1}`} />)
        row3.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderTopWidth:0,
            borderBottomWidth:0
        }} key={`${3}_${2}`} />)
        row3.push(<View style={{
            flex: 1,
            borderWidth: 0.2,
            borderColor: '#FFFFFF',
            borderTopWidth:0,
            borderBottomWidth:0,
            borderRightWidth:0,
        }} key={`${3}_${3}`} />)
        grid.push(<View style={styles.gridRow} key={1}>{row1}</View>)
        grid.push(<View style={styles.gridRow} key={2}>{row2}</View>)
        grid.push(<View style={styles.gridRow} key={3}>{row3}</View>)

        // for (let i = 0; i < 3; i++) {
        //   const row = [];
    
        //   for (let j = 0; j < 3; j++) {
        //     row.push(<View style={i ==0 ? styles.gridColumn0 : i != 3 ? styles.gridColumn:styles.gridColumn1} key={`${i}_${j}`} />);
        //   }
        //   console.log(row)
        //   grid.push(<View style={styles.gridRow} key={i}>{row}</View>);
        // }
    
        return <View style={styles.overlay}>{grid}</View>;
      };
    return (
        <View style={styles.container}>
            <View style={{ width: '95%', alignSelf: 'center' }}>
                <VerticalSpace height={0.05} />
                <View style={{ top: isIphoneX() ? 10 : 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setFlash(!flash)}>
                        {
                            flash ? <Image source={require('../../../assets/images/iconsCameraFlash.png')} />
                                :
                                <Image source={require('../../../assets/images/iconsCameraFlashOff.png')} />
                        }
                    </TouchableOpacity>
                    <View style={{ height: 30, width: 72, marginLeft: 20 }}>
                        <Image source={require('../../../assets/images/brandingLogoPicitHorizontalBlue.png')} style={{ height: 30, width: 72 }} />
                    </View>
                    <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                        <Image source={require('../../../assets/images/iconsNavBarIconsIcSidemenuWhiteNote.png')} />
                    </TouchableOpacity>
                </View>
                <VerticalSpace height={0.04} />
                <View style={styles.cameraContainer}>
                <Animated.View style={[{ opacity: blinkOpacity }]}>
                    <RNCamera
                        playSoundOnCapture={false}
                        ref={cameraRef}
                        captureAudio={false}
                        pictureSize={cameraResolution ? cameraResolution.name : undefined}
                        captureQuality={cameraResolution ? cameraResolution.name : false}
                        style={styles.preview}
                        useNativeZoom={true}
                        zoom={0}
                        cropping={false}
                        flashMode={flash ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                        type={flipCamera ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                    />
                    {renderGrid()}
                    </Animated.View>
                </View>
                <View style={{ alignSelf: 'center', top: 15, height: 40 }} >
                </View>
                {(count >= 1 && sawInfo != 'yes') ?
                    <View style={[styles.box]}>
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 15 }]}>{'בחירת תמונות לאלבום'}</Text>
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 13 }]}>{`כאן בוחרים לאיזה אלבום לצרף את${'\n'}התמונה שצילמתם`}</Text>
                        <TouchableOpacity onPress={() => {
                            setCount(count + 1)
                            AsyncStorage.setItem('sawInfo', 'yes')
                            setSawInfo('yes')
                        }} style={{ width: 120, height: 40, backgroundColor: colors.white, borderRadius: 17, justifyContent: 'center', top: 10 }}>
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 15, color: colors.register }]}>{'הבנתי'}</Text>
                        </TouchableOpacity>
                        <View style={[styles.triangle2]} />
                    </View>
                    : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', top: 30, right: 4 }}>
                    {pictures.length > 0 || allSharedPictures?.length > 0 ?
                        <TouchableOpacity style={styles.images} onPress={() => {
                            if (pictures?.length == 0 && allSharedPictures?.length > 0) {
                                navigation.navigate("ChooseImages",
                                    {
                                        pictures, chosenPictureStartScreen: '2',
                                    })
                            } else {
                                navigation.navigate("ChooseImages",
                                    {
                                        pictures, chosenPictureStartScreen: '1',
                                    })
                            }
                        }}>
                            <Image style={{
                                borderRadius: 10,
                                height: 50,
                                width: 50
                            }}
                                source={{ uri: firstPicture }}
                            />
                            <View style={{ position: 'absolute', right: 40, bottom: 40, width: 25, height: 25, borderRadius: 8, backgroundColor: colors.red, justifyContent: 'center' }}>
                                <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 12, textAlign: 'center' }]}>{countAllPicturesAndSharedPhotos}</Text>
                            </View>
                        </TouchableOpacity> : <View style={{ width: 60 }} />}
                    <TouchableOpacity onPress={takePicture}>
                        <Image source={require('../../../assets/images/iconsCameraCapture.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFlipCamera(!flipCamera)}>
                        {
                            flipCamera ? <Image source={require('../../../assets/images/iconsCameraFlipSide1.png')} />
                                :
                                <Image source={require('../../../assets/images/iconsCameraFlipSide2.png')} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
            {/* <PopupCameraPermission onButtonPress={() => {
                openSettings()
                setTimeout(() => {
                    RNExitApp.exitApp();

                }, 500)

            }} isVisible={permissionGranted} /> */}
            {/* <PopupError /> */}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    box: {
        width: width * 0.65,
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
        backgroundColor: colors.register,
        position: "absolute",
        left: 0,
        bottom: 60,
        borderRadius: 26
    },
    triangle2: {
        width: 10,
        height: 10,
        position: "absolute",
        transform: [{ rotate: '180deg' }],
        top: 153,
        left: 48,
        borderLeftWidth: 17,
        borderLeftColor: "transparent",
        borderRightWidth: 17,
        borderRightColor: "transparent",
        borderBottomWidth: 17,
        borderBottomColor: colors.register
    },
    cameraContainer: {
        borderRadius: 26,
        width: '100%',
        height: height * 0.6,
        alignSelf: 'center',
        overflow: 'hidden',
        position: 'relative'
    },
    preview: {
        height: height * 0.6,
    },
    images: {
        borderRadius: 15,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    cardText: {
        fontFamily: 'Arimo-Regular', fontSize: 12, textAlign: 'center', color: colors.white
    },
    textBubble: {
        width: width * 0.7,
        height: height * 0.22,
        position: 'absolute',
        backgroundColor: colors.register,
        borderRadius: 26
    },
    camera: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    gridRow: {
      flex: 1,
      flexDirection: 'row',
    },
    gridColumn: {
      flex: 1,
      borderWidth: 0.2,
      borderColor: '#FFFFFF',
    },
    gridColumn0:{
        flex: 1,
        borderWidth: 0.2,
        borderColor: '#FFFFFF',
        borderTopWidth:0,
        borderBottomWidth:0
    },
    gridColumn1:{
        flex: 1,
        borderWidth: 0.2,
        borderColor: '#FFFFFF',
        borderLeftWidth:0,
        borderBottomWidth:0,
    }
  });