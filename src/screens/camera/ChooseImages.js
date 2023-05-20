
import { RNCamera } from 'react-native-camera';
import React, { Component, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { colors } from '../../colors';
import { VerticalSpace } from '../../utilities/verticalSpace'
import Button from '../../utilities/button'
import Carousel from 'react-native-snap-carousel';
import Share from 'react-native-share';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { setPics, setPopupSavePic, setPictureToDelete, setPopupDeletePhoto, setCountReadyForOrderAlbums, setChosenPicture, setPopupError, setSharedPhotos, setRouteFromNotification } from '../../redux'
import { getAllSharedImages, getCounter } from '../../api'
import { useSelector, useDispatch } from 'react-redux'
import PopupSavePic from '../popups/popupSavePic'
import { _setPics } from '../../helpers/albumHelper';
import PopupDeletePhoto from '../popups/popupDeletePhoto';
import { fetchAlbums, removePictureFromAlbumApi, updateAlbumApi, setHalfFullAlbum, setFullAlbum } from '../../api';
import { countPhotosInAlbum } from '../../utilities/lpicturesCounter';
import AnimatedLoader from "react-native-animated-loader";
import { isIphoneX } from 'react-native-iphone-x-helper';
import PopupError from '../popups/popupError';
import { Lofi } from 'react-native-image-filter-kit';
import { useInsertionEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function ChooseImages({ navigation }) {
    const [uri, setMainUri] = useState(navigation.state.params.pictures)
    const { user,
        popupSavePic,
        popupDeletePhoto,
        pictures,
        allSharedPictures,
        countReadyForOrderAlbums,
        routeFromNotification,
        chosenPicture } = useSelector(state => state.user)
    const [screen, setScreen] = useState(navigation.state.params.chosenPictureStartScreen); // 1 my pictures, 2 shared with me
    const [refreshFlatlist, setRefreshFlatList] = useState(true);
    const [saved, setSaved] = useState([])
    const [newOrFullpopup, setNewOrFullpopup] = useState(false)
    const [savedScreen, setSavedScreen] = useState('1')
    const CarouselRef = useRef(null)
    const dispatch = useDispatch()
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [chosenPic, setChosenPic] = useState(navigation.state.params.chosenPics != undefined 
        ? navigation.state.params.chosenPics : 0)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const [loading, setLoading] = useState(false)
    function handleBackButtonClick() {
        console.log("back");
        navigation.navigate('Camera', { refreshPage: true })
        return true;
    }

    const updateSharedPhotos = async () => {
        await getAllSharedImages(user.token).then(res => {
            // console.log(res,'resresresresres');
            return res
        }).then(response => dispatch(setSharedPhotos(response.data)))
    }

    useEffect(() => {
        if (screen === '2') {
            if (routeFromNotification === 'gallery') {
                if(allSharedPictures.length > 0 )
                setLoading(true)
            }
            updateSharedPhotos()
            if (routeFromNotification === 'gallery') {
                countSize(0)
            }
            else {
                countSize(0)
            }
            dispatch(setRouteFromNotification(''))
            console.log('screen Two effect check ', chosenPic, ' -- ', CarouselRef );

        }
    }, [allSharedPictures.length])
    
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    useLayoutEffect(() => {
        console.log(chosenPic, 'yes checking -->>>>')
        if (screen === '1') {
            setMainUri([...pictures])
        }
        setChosenPic(chosenPicture)
        if (navigation.state.params?.imgSize) {
            setImageSize({ ...navigation.state.params?.imgSize })
        }        
        
    }, [JSON.stringify(pictures), JSON.stringify(allSharedPictures)])

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true
        }).start();
    };

    useEffect(() => {
        setMainUri(pictures)        
        if(chosenPic == 0){
            setChosenPic(0)
            countSize(chosenPic)
            CarouselRef.current.snapToItem(0, true)
        }
        else{
            setChosenPic(chosenPic - 1)
            countSize(chosenPic -1)
            CarouselRef.current.snapToItem(chosenPic - 1, true)
        }
        
        console.log('dsad chek 1' ,chosenPic)        
    }, [screen])

    function countSize(index) {
        let url = ''
        if (screen === '1' && uri[index]?.uri) {
            url = uri[index]?.uri
        } else if (allSharedPictures[index]?.photo) {
            url = allSharedPictures[index]?.photo
        }
// console.log(allSharedPictures, 'allSharedPictures');

        if (url !== null) {
            Image.getSize(url, (imgWidth, imgHeight) => {
                setContainerSize({ height: width, width: width - 60 })
                let imageSizev = {}
                if (imgWidth < imgHeight) {
                    if (Math.floor(imgWidth * (width - 50 / imgHeight)) > width - 50) {
                        imageSizev = {
                            width: Math.floor(imgWidth * ((width - 50) / imgHeight)) - (Math.floor(imgWidth * ((width - 50) / imgHeight)) - (width - 50)),
                            height: width
                        }
                    } else {
                        imageSizev = {
                            width: Math.floor(imgWidth * ((width - 50) / imgHeight)),
                            height: width
                        }
                    }
                } else if (imgWidth > imgHeight) {
                    imageSizev = {
                        width: width - 60,
                        height: Math.floor(imgHeight * ((width - 50) / imgWidth))
                    }
                } else {
                    imageSizev = {
                        width: width - 50,
                        height: width
                    }
                }
                setChosenPic(index)
                setImageSize({ ...imageSizev })
                setLoading(false)
            })
        }
    }

    const updateAlbumStatus = (item) => {
        const formData = new FormData
        formData.append('token', user.token)
        formData.append('id', item.id)
        formData.append('albume_name', item['albume_name'])
        formData.append('max_images', data[0].value)
        formData.append('status', '1')
        updateAlbumApi(formData).then(res => {
            console.log('responce update album status1', res)
        })
    }

    async function saveImage() {
        console.log('saved uimage --------------> 1' )
        dispatch(setPopupSavePic(true))
        console.log('saved uimage --------------> 0', screen)
        if (screen == '1') {
            if (uri?.length - 1 == 0) {
                navigation.setParams({ shouldNavigateToCameraScreen: true })
            } else {
                navigation.setParams({ shouldNavigateToCameraScreen: false })                
            }
        } else {
            navigation.setParams({ albumId: allSharedPictures[chosenPic].albumes_id.toString() })
            if (allSharedPictures?.length - 1 == 0 && uri?.length == 0) {
                navigation.setParams({ shouldNavigateToCameraScreen: true })
            } else {
                navigation.setParams({ shouldNavigateToCameraScreen: false })
            }
        }
    }

    function deletePic() {  
        if (screen == '1') {
           console.log('check ---------------->>>  screen ', screen, + ' chosenPic ', chosenPic)

            // console.log('checking new 1', uri.length, '  ---  ', chosenPic)
            if (chosenPic == uri.length - 1)
                setChosenPic(uri.length - 1)
            uri.splice(chosenPic, 1)
            _setPics(uri);
            dispatch(setPics(uri))
            setRefreshFlatList(!refreshFlatlist)            
            if (uri.length === 0) {
                navigation.navigate('Camera')
            }
            if(CarouselRef?.current != null){
                if(chosenPic == 0){
                    setChosenPic(0)
                    countSize(0)
                    CarouselRef.current.snapToItem(0, true)
                }
                else
                {
                    setChosenPic(chosenPic - 1)
                    countSize(chosenPic - 1)
                    CarouselRef.current.snapToItem(chosenPic - 1, true)
                }
            }                        
        }

        if (screen == '2') {
            const disApprovePhoto = allSharedPictures[chosenPic]
            const formData = new FormData
            formData.append('token', user.token)
            formData.append('picture_id', disApprovePhoto.photo_id)
            setLoading(true)
            removePictureFromAlbumApi(formData).then(response => {
                if (response != 0) {
                    if (chosenPic == allSharedPictures.length - 1) {
                        setChosenPic(allSharedPictures.length - 2)
                    } else {
                        setChosenPic(chosenPic + 1)
                    }
                    allSharedPictures.splice(chosenPic, 1)

                    if (allSharedPictures.length === 0) {
                        navigation.navigate('Camera')
                    }
                } else {
                }

                setLoading(false)
                if (response.success == 1) {
                    console.log('response--------->', response)
                } else {
                    console.log('response--------->', response)
                }
            })
            setRefreshFlatList(!refreshFlatlist)
        }
    }

    const sharePhoto = () => {
        if (screen === '1') {
            let options = {
                url: uri[chosenPic].uri,
                type: 'image/jpg',
            }
            Share.open(options).then(res => console.log('res', res))
        }
    }
    const [data, setData] = useState([])
    useEffect(() => {
        if(!data){
            getCounter().then(res => {
                console.log("Counter res4 ->", res)
                setData(res)})
        }

    }, [data])
    useEffect(() => {
        if (uri[chosenPic] == saved) {
            setSavedScreen('1')
        }
    },[])

    function setCor(){
        console.log(uri[chosenPic], saved);
        console.log('dsad hcekc 2 ', chosenPic)
        if(CarouselRef?.current != null){
            if(chosenPic == 0){
                CarouselRef.current.snapToItem(0, true)
            }
            else
            {
                CarouselRef.current.snapToItem(chosenPic - 1, true)
            }
        }  
    };
    const [longPress, setLongPress] = useState(false)

    const [multipleImage, setMultipleImage] = useState([])


    const callbackFunction = (childData) => {
        console.log('Call Back Function from chooseimages -> ', childData)
        let newOrFull = false
        fetchAlbums(user.token).then(response => {
            
            for (let i = 0; i < response.data.length; i++) {
                console.log('Image -->',response.data[i].id)

                if (response.data[i]["max_images"] == "240" || response.data[i]["max_images"] == (data[2].value)) updateAlbumStatus(response.data[i])
                const photosInAlbum = String(countPhotosInAlbum(response.data[i], user.userId))

                if ((photosInAlbum == response.data[i]["max_images"]) && response.data[i]["status"] == 2) {
                    newOrFull = true
                    updateAlbumStatus(response.data[i]);
                    navigation.navigate('WeHaveNewAlbum', { item: { ...response.data[i], status: 1 }, photoFromGallery: screen == '2' ? true : false })

                    const newCount = countReadyForOrderAlbums + 1
                    dispatch(setCountReadyForOrderAlbums(newCount))
                }
                if ((photosInAlbum == "200" || photosInAlbum == (data[1].value)  && response.data[i]["max_images"] == (data[1].value)  ||  response.data[i]["max_images"] == "200") && response.data[i].half_full_album == 0) {
                    newOrFull = true
                    navigation.navigate('WeHaveNewAlbum', { item: { ...response.data[i] }, photoFromGallery: screen == '2' ? true : false })

                    const formData = new FormData
                    formData.append('token', user.token)
                    formData.append('album_id', response.data[i].id)
                    formData.append('half_full_album', '1')
                    setHalfFullAlbum(formData).then((res) => {
                        navigation.navigate('WeHaveNewAlbum', { item: { ...response.data[i] }, photoFromGallery: screen == '2' ? true : false })
                    })
                }
                if ((photosInAlbum == "240" || photosInAlbum == (data[2].value) && response.data[i]["max_images"] == "240" || response.data[i]["max_images"] == (data[1].value)) && response.data[i].is_album_full === '0') {
                    newOrFull = true

                    const formData = new FormData
                    formData.append('token', user.token)
                    formData.append('album_id', response.data[i].id)
                    formData.append('is_album_full', '1')

                    setFullAlbum(formData).then(() => {
                        navigation.navigate('WeHaveFullAlbum', { item: { ...response.data[i] }, photoFromGallery: screen == '2' ? true : false })
                    })

                }
            }
            if (screen == '1' && uri?.length == 0 && !newOrFull) {
                navigation.navigate('Camera', { refreshPage: true })
            }
            if (screen == '2' && allSharedPictures?.length == 0 && !newOrFull) {
                navigation.navigate('Camera', { refreshPage: true })
            }
        })
        
        console.log(chosenPic, CarouselRef , 'checkinf ')
        if (childData?.status_code == "200") {
            setSaved(childData)
        }
        else setSaved(childData)
        fadeIn()
        setSaved(childData)
        // setSavedScreen('2')
        // const wait = time => new Promise((resolve) => setTimeout(resolve, time));
        // if (pictures.length === 1 && !newOrFullpopup) {
        //     wait("200"0)
        //         .then(() => {
        //             setSavedScreen('1')
        //         })
        //         .then(() => {
        //             // setRefreshFlatList(!refreshFlatlist)
        //             console.log('checkign new Ts')
        //         })
        // } else {
        //     wait(1000).then(async () => {
        //         setSavedScreen('1')
        //         // setRefreshFlatList(!refreshFlatlist)
        //         console.log(chosenPic, CarouselRef , 'checkinf ')
        //         // if(chosenPic == 0){
        //         //     setChosenPic(0)
        //         //     countSize(0)
        //         //     CarouselRef.current.snapToItem(0, true)
        //         // }
        //         // else
        //         // {
        //         //     setChosenPic(chosenPic - 1)
        //         //     countSize(chosenPic - 1)
        //         //     CarouselRef.current.snapToItem(chosenPic - 1, true)
        //         // } 
        //         console.log('checkign new ks')
        //     })
        // }
    }

    const myPhotos = {
        backgroundColor: screen == '1' ? colors.register : colors.black,
        color: colors.white,
        height: 40,
        fontSize: 15,
        width: 139,
        borderRadius: 19,
        justifyContent: 'center',
        bottom: 12,
        fontFamily: 'Arimo-Regular',
    }
    const sharedWithMe = {
        backgroundColor: screen == '1' ? colors.black : colors.shared,
        color: colors.white,
        height: 40,
        fontSize: 15,
        width: 139,
        borderRadius: 19,
        justifyContent: 'center',
        bottom: 12,
        fontFamily: 'Arimo-Regular',
    }
    const [touchY, setTouchY] = useState()
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };
    return (
        savedScreen == '1' ?
            <View style={styles.container}>
                <AnimatedLoader //++
                    visible={loading}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../../../assets/picitLoader.json")}
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1}
                ></AnimatedLoader>
                <View style={{ width: '95%', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: isIphoneX() ? 50 : 20 }}>
                        <TouchableOpacity opacity={screen === '1' ? .7 : 1} style={{ width: 45 }} onPress={() => { sharePhoto() }} >
                            {screen === '1' ? <Image source={require('../../../assets/images/buttonsNavBarButtonsIconOnlyButton.png')} /> : null}
                        </TouchableOpacity>
                        <Text style={styles.cardText}>{'בחירת תמונות לאלבום'}</Text>
                        <TouchableOpacity style={{ zIndex: 1 }} onPress={() => { navigation.navigate('Camera', { refreshPage: true }) }}>
                            <Image source={require('../../../assets/images/buttonsNavBarButtonsCircleButtonBlackAlpha.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-evenly', width: 280, alignSelf: 'center' }}>
                        <Button buttonStyles={sharedWithMe} onPress={() => setScreen('2')} text={`שותפו איתי (${allSharedPictures.length})`} />
                        <Button buttonStyles={myPhotos} onPress={() => setScreen('1')} text={`התמונות שלי (${uri?.length})`} />
                    </View>
                    
                    {
                        screen == '1' ?
                            <View>
                                <View style={styles.cameraContainer}>
                                    {
                                        uri[chosenPic] && uri[chosenPic].uri ?

                                            <View style={{
                                                overflow: 'hidden',
                                                width: imageSize.width,
                                                height: imageSize.height,
                                                borderRadius: 20,
                                            }}
                                            >
                                                <TouchableOpacity style={styles.edit} onPress={() => {
                                                    dispatch(setPictureToDelete(uri[chosenPic].uri));
                                                    dispatch(setChosenPicture(chosenPic))
                                                    navigation.navigate('EditImage', {
                                                        chosenPicUri: uri[chosenPic].uri,
                                                        photoFromCamera: true
                                                    })
                                                }}>
                                                    <Text style={styles.cardText}>{'עריכה'}</Text>
                                                </TouchableOpacity>
                                                <GestureRecognizer
                                                    onSwipeLeft={(state) => {
                                                        if(chosenPic != (uri?.length -1)){
                                                            console.log("Choosen left pic index-->", chosenPic )
                                                            countSize(chosenPic+1);
                                                            CarouselRef.current.snapToItem(chosenPic+1, true)
                                                            setChosenPic(chosenPic+1)

                                                        }
                                                    }}
                                                    
                                                    
                                                    onSwipeRight={(state) => {
                                                        if(chosenPic != 0){
                                                            console.log("Choosen right pic index-->", chosenPic-1 )
                                                            countSize(chosenPic-1); CarouselRef.current.snapToItem(chosenPic-1, true)}
                                                            setChosenPic(chosenPic-1)
                                                            setChosenPic(chosenPic-1)
                                                        }
                                                        
                                                    }
                                        
                                                    config={config}
                                                    >
                                                <Image style={{
                                                    width: imageSize.width,
                                                    height: imageSize.height,
                                                }}
                                                    source={{ uri: uri[chosenPic].uri }}
                                                />
                                                </GestureRecognizer>
                                            </View>
                                            
                                            : null
                                    }

                                </View>
                                <Carousel
                                    containerCustomStyle={{ alignSelf: 'center', bottom: 10 }}
                                    ref={CarouselRef}
                                    data={uri}
                                    inactiveSlideScale={0.9}
                                    onBeforeSnapToItem={(activeIndex) => {
                                        setChosenPic(activeIndex)
                                    }}
                                    renderItem={({ index }) => {
                                        return (
                                            <View>
                                                <TouchableOpacity
                                                    onLongPress={() => {
                                                        setLongPress(true)
                                                        console.log("Long press")
                                                        let check = multipleImage.filter(val => val == index)
                                                        if(check.length == 0){
                                                            setMultipleImage([...multipleImage, index])
                                                        }else{
                                                            console.log("Already selected")
                                                        }
                                                        
                                                    }}
                                                    key={index}
                                                    style={longPress ? multipleImage.includes(index) ? styles.selectedImageStyle : chosenPic == index ? styles.images : styles.chosenImage : chosenPic == index ? styles.images : styles.chosenImage}
                                                    onPress={() => { 
                                                        countSize(index); CarouselRef.current.snapToItem(index, true) 
                                                        if(longPress){
                                                            let check = multipleImage.filter(val => val == index)
                                                            if(check.length == 0){
                                                                setMultipleImage([...multipleImage, index])
                                                            }else{
                                                                let newData = multipleImage.filter(val => val != index)
                                                                setMultipleImage(newData)
                                                                if(newData.length ==0){
                                                                    setLongPress(false)
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <View style={{ position: 'relative' }}>
                                                    <Image style={{
                                                        borderRadius: 10,
                                                        height: 55,
                                                        width: 55
                                                    }}
                                                        source={{ uri: uri[index].uri }}
                                                    />
                                                    {longPress && multipleImage.includes(index) && (
                                                        <Image source={require('../../../assets/images/iconsCirclePurple.png')} style={styles.selectedImageStyle1} />
                                                    )}
                                                    </View>
                                                    
                                                    
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                    ListEmptyComponent={() => { return (<View style={{ height: 95 }} />) }}
                                    sliderWidth={width}
                                    itemWidth={75}
                                />
                            </View>
                            : // savedScreen 2
                            <View>
                                <View style={styles.cameraContainer}>
                                    {
                                        allSharedPictures[chosenPic] && allSharedPictures[chosenPic].photo ?
                                            <View style={{
                                                overflow: 'hidden',
                                                width: imageSize.width,
                                                height: imageSize.height,
                                                borderRadius: 20,
                                            }}

                                            >
                                                <TouchableOpacity style={styles.edit} onPress={() => {
                                                    navigation.navigate('EditImage', { chosenPicUri: allSharedPictures[chosenPic].photo, photoFromCamera: false });
                                                    dispatch(setPictureToDelete(allSharedPictures[chosenPic]))
                                                    dispatch(setChosenPicture(chosenPic))
                                                }}>
                                                    <Text style={styles.cardText}>{'עריכה'}</Text>
                                                </TouchableOpacity>
                                                <GestureRecognizer
                                                    onSwipeLeft={(state) => {
                                                        if(chosenPic != (uri?.length -1)){

                                                            console.log("Choosen left pic index-->", chosenPic )
                                                            countSize(chosenPic+1);
                                                            CarouselRef.current.snapToItem(chosenPic+1, true)
                                                            setChosenPic(chosenPic+1)
                                                        }
                                                    }}
                                                    
                                                    
                                                    onSwipeRight={(state) => {
                                                        if(chosenPic != 0){
                                                            console.log("Choosen right pic index-->", chosenPic-1 )
                                                            countSize(chosenPic-1); CarouselRef.current.snapToItem(chosenPic-1, true)}
                                                            setChosenPic(chosenPic-1)
                                                        }
                                                        
                                                    }

                                                    config={config}
                                                    >
                                                <Image style={{
                                                    width: imageSize.width,
                                                    height: imageSize.height,

                                                }}
                                                    source={{ uri: allSharedPictures[chosenPic].photo }}
                                                />
                                                </GestureRecognizer>
                                                <View style={{
                                                    height: 40,
                                                    borderRadius: 20,
                                                    backgroundColor: 'rgb(251,235,232)',
                                                    alignSelf: 'flex-end',
                                                    bottom: 50,
                                                    right: 15,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end'
                                                }}>

                                                    <Text
                                                        style={{
                                                            marginLeft: 10,
                                                            textAlign: 'right',
                                                            fontFamily: 'Arimo-Regular',
                                                            color: 'rgb(249,137,92)',
                                                            marginVertical: 'auto'
                                                        }}>
                                                        {`שותף על ידי ${allSharedPictures[chosenPic].sharedBy}`}
                                                    </Text>
                                                    <Image style={{ marginLeft: 3, marginRight: 10, width: 25, height: 25 }} source={require('../../../assets/images/iconsFolderContact.png')} />
                                                </View>
                                            </View>
                                            : null
                                    }

                                </View>
                                <Carousel
                                    containerCustomStyle={{ alignSelf: 'center', bottom: 10 }}
                                    ref={CarouselRef}
                                    data={allSharedPictures}
                                    inactiveSlideScale={0.9}
                                    onBeforeSnapToItem={(activeIndex) => {
                                        setChosenPic(activeIndex)
                                    }}
                                    renderItem={({ index }) => {
                                        return (
                                            <TouchableOpacity key={index} style={chosenPic == index ? styles.images : styles.chosenImage} onPress={() => { countSize(index); CarouselRef.current.snapToItem(index, true) }}>
                                                <ImageBackground style={{
                                                    height: 55,
                                                    width: 55,
                                                }}
                                                    source={{ uri: allSharedPictures[index].photo }}
                                                    imageStyle={{ borderRadius: 10 }}
                                                >
                                                    <Image style={{ height: 25, width: 25, alignSelf: 'flex-end', top: 28, right: 4 }} source={require('../../../assets/images/iconsShareUser.png')} />
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    ListEmptyComponent={() => { return (<View style={{ height: 75 }} />) }}
                                    sliderWidth={width}
                                    itemWidth={75}
                                />
                            </View>
                    }

                    {(allSharedPictures?.length == 0 && screen == '2') || (uri?.length == 0 && screen == '1') ? null : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: -height * 0.065 }}>
                            <Button text="שמירה לאלבום" buttonStyles={buttonStyles} onPress={() => { saveImage() }} />
                            <TouchableOpacity style={styles.trash} onPress={() => {
                                dispatch(setPopupDeletePhoto(true))
                                navigation.setParams({ deleteSharedPhotos: true, screen })
                            }}>
                                <Image source={require('../../../assets/images/iconsDelete.png')} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <PopupSavePic
                    navigation={navigation}
                    parentCallback={(childData) => callbackFunction(childData)}
                    popupSavePic={popupSavePic}
                    item={screen == '2' ? allSharedPictures[chosenPic] : uri[chosenPic]}
                    deletePicture={deletePic}
                    chosenPic= {chosenPic}
                    picturesLength={screen == '2' ? allSharedPictures.length : pictures.length}
                    photoFromGallery={screen == '2' ? true : false}
                />
                <PopupDeletePhoto navigation={navigation} deletePicture={deletePic} popupDeletePhoto={popupDeletePhoto} />
            </View>
            : // savedScreen 3 
            <View style={styles.container}>
                <View style={{ width: '95%', alignSelf: 'center', bottom: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', top: height * 0.035 }}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image source={require('../../../assets/images/buttonsNavBarButtonsIconOnlyButton.png')} />
                        </TouchableOpacity>
                        <Text style={styles.cardText}>{'בחירת תמונות לאלבום'}</Text>
                        <TouchableOpacity style={{ zIndex: 1 }} onPress={() => { navigation.goBack() }}>
                            <Image source={require('../../../assets/images/buttonsNavBarButtonsCircleButtonBlackAlpha.png')} />
                        </TouchableOpacity>
                    </View>
                    <View  style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-evenly', width: 280, alignSelf: 'center' }}>
<Button buttonStyles={sharedWithMe} onPress={() => setScreen('2')} text={`שותפו איתי (${allSharedPictures.length})`} />
<Button buttonStyles={myPhotos} onPress={() => setScreen('1')} text={`התמונות שלי (${uri.length})`} />
</View>
                   
                    {screen == '1' ?
                        <View>
                            <View style={styles.cameraContainer}>
                                {
                                    uri[chosenPic] && uri[chosenPic].uri ?
                                        <View>
                                            <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('EditImage', uri[chosenPic].uri)}>
                                                <Text style={styles.cardText}>{'עריכה'}</Text>
                                            </TouchableOpacity>
                                            <Image style={{
                                                borderRadius: 20,
                                                width: '100%',
                                                height: height * 0.58,
                                            }}
                                                source={{ uri: uri[chosenPic]?.uri }}
                                            />
                                            {uri[chosenPic] == saved ?
                                                <View style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    ...StyleSheet.absoluteFillObject,
                                                    backgroundColor: 'rgba(0,0,0,0.5)'
                                                }}>
                                                    <Image source={require('../../../assets/images/iconsCircleCheckWhite.png')} style={{ height: 84, width: 84 }} />
                                                </View> : null}
                                        </View>
                                        : null
                                }

                            </View>
                            <Carousel
                                containerCustomStyle={{ alignSelf: 'center', bottom: 10 }}
                                ref={CarouselRef}
                                data={uri}
                                inactiveSlideScale={0.9}
                                onBeforeSnapToItem={(activeIndex) => {
                                    setChosenPic(activeIndex)
                                }}
                                renderItem={({ index }) => {
                                    return (
                                        <View>
                                            <TouchableOpacity key={index} style={chosenPic == index ? styles.images : styles.chosenImage} onPress={() => { setChosenPic(index); CarouselRef.current.snapToItem(index, true) }}>
                                                <Image style={{
                                                    borderRadius: 10,
                                                    height: 55,
                                                    width: 55
                                                }}
                                                    source={{ uri: uri[index].uri }}
                                                />
                                            </TouchableOpacity>
                                            {uri[index] == saved ?
                                                <View style={{ bottom: 20, alignSelf: 'center', width: 20, height: 20, backgroundColor: colors.green, borderRadius: 5, justifyContent: 'center' }}>
                                                    <Image style={{ width: 10, height: 10, alignSelf: 'center', top: 1 }} source={require('../../../assets/images/check.png')} />
                                                </View> : <View style={{ height: 20 }} />
                                            }
                                        </View>
                                    )
                                }}
                                ListEmptyComponent={() => { return (<View style={{ height: 195 }} />) }}
                                sliderWidth={width}
                                itemWidth={75}
                            />
                        </View>
                        : //screen 2
                        <View>
                            <View style={styles.cameraContainer}>
                                {
                                    uri[chosenPic] && uri[chosenPic].uri ?
                                        <View>
                                            <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('EditImage', uri[chosenPic].uri)}>
                                                <Text style={styles.cardText}>{'עריכה'}</Text>
                                            </TouchableOpacity>
                                            <Image style={{
                                                borderRadius: 20,
                                                width: '100%',
                                                height: height * 0.58,
                                            }}
                                                source={{ uri: uri[chosenPic].uri }}
                                            />
                                        </View>
                                        : null
                                }

                            </View>
                            <Carousel
                                containerCustomStyle={{ alignSelf: 'center', bottom: 10 }}
                                ref={CarouselRef}
                                data={uri}
                                inactiveSlideScale={0.9}
                                onBeforeSnapToItem={(activeIndex) => {
                                    setChosenPic(activeIndex)
                                }}
                                renderItem={({ index }) => {
                                    return (
                                        <TouchableOpacity key={index} style={chosenPic == index ? styles.images : styles.chosenImage} onPress={() => { setChosenPic(index); CarouselRef.current.snapToItem(index, true) }}>
                                            <Image style={{
                                                borderRadius: 10,
                                                height: 60,
                                                width: 60
                                            }}
                                                source={{ uri: uri[index].uri }}
                                            />
                                        </TouchableOpacity>
                                    )
                                }}
                                ListEmptyComponent={() => { return (<View style={{ height: 75 }} />) }}
                                sliderWidth={width}
                                itemWidth={75}
                            />
                        </View>}
                    <Animated.Image
                        source={require('../../../assets/images/buttonsNavBarButtonsLabel.png')}

                        style={[
                            { width: 260, height: 40, alignSelf: 'center' },
                            {
                                opacity: 1
                            }
                        ]}
                    >
                    </Animated.Image>
                </View>
            </View>
    );
}

const buttonStyles = {
    backgroundColor: colors.nextButton,
    color: colors.black,
    height: 55,
    fontSize: 17,
    width: width * 0.5,
    borderRadius: 26,
    justifyContent: 'center',
    fontFamily: 'Arimo-Bold',

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    cameraContainer: {
        borderRadius: 26,
        width: '90%',
        height: height * 0.6,
        alignSelf: 'center',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    preview: {
        height: height * 0.6,
    },
    images: {
        borderRadius: 15,
        height: 65,
        width: 65,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    trash: {
        borderRadius: 20,
        height: 50,
        width: 50,
        top: 10,
        left: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    chosenImage: {
        borderRadius: 15,
        height: 65,
        width: 65,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    cardText: {
        fontFamily: 'Arimo-Regular', fontSize: 17, textAlign: 'center', color: colors.white
    },
    fadingContainer: {
        paddingVertical: 5,
        paddingHorizontal: 25,
        backgroundColor: "lightseagreen"
    },
    edit: {
        width: 73,
        position: 'absolute',
        height: 40,
        backgroundColor: colors.edit,
        zIndex: 10,
        left: 20,
        borderColor: colors.white,
        borderWidth: 0.3,
        justifyContent: 'center',
        borderRadius: 18,
        top: 10
    },
    selectedImageStyle:{
        borderRadius: 15,
        height: 65,
        width: 65,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    selectedImageStyle1:{
        width:20,
        height:20,
        position: 'absolute', top: -5, right: -3 
    }
});