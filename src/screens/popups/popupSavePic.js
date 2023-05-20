import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import { colors } from '../../colors'
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux'
import { setPopupError, setPopupSavePic } from '../../redux'
import { VerticalSpace } from '../../utilities/verticalSpace'
import { fetchAlbums, saveImg, setApprovePhoto, getCounter, newAlbum } from '../../api'
import RadioButton from '../../utilities/radioButton'
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { getAllSharedImages } from '../../api';
import { fetchAlbumsData } from '../../helpers/albumHelper';
import { saveImgData } from '../../helpers/albumHelper';
import AnimatedLoader from "react-native-animated-loader";
import { countPhotosInAlbum } from '../../utilities/lpicturesCounter';
import { setSharedPhotos } from '../../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function popupSavePic(props) {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const { popupSavePic, item, navigation, deletePicture, chosenPic, picturesLength, photoFromGallery } = props
    const [albums, setAlbums] = useState([])
    const [albumsIds, setAlbumsIds] = useState(photoFromGallery && item?.albumes_id ? [item.albumes_id] : [])
    const [bigger, setBigger] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [defaultId, setDefaultId] = useState(0)

    const fetchAllAlboms = async  () => {
        setLoading(true);
        var result = await fetchAlbumsData();
        var ids = await AsyncStorage.getItem('default_album_id')

        if(result != -1 && result.data){
        // fetchAlbums(user.token).then(response => {
            getCounter().then(res => {
                let i=0;
                let len = result.data.length;
                for(i; i < len; i++){
                    if(result.data[i].updated == '0000-00-00 00:00:00'){
                        console.log('Date updated')
                        result.data[i].updated = result.data[i].created;
                    }
                }
                console.log(result.data)
                let newAlbum = result.data.sort((a, b) => (a.updated < b.updated || a.created > a.updated) ? 1 : ((b.updated < a.updated) ? -1 : 0))
                if(newAlbum[0].max_images == "160"){
                    newAlbum[0].new_max_images = res[0] ? res[0].value : "160"
                }
                else if(newAlbum[0].max_images == "200"){
                    newAlbum[0].new_max_images = res[1] ? res[0].value : "200"
                }
                else if(newAlbum[0].max_images == "240"){
                    newAlbum[0].new_max_images = res[2] ? res[0].value : "240"
                }


                setAlbums(newAlbum)
                setData(newAlbum)
        setLoading(false)
                

                if (result == 0 && popupSavePic) {
                    console.log('Error', popupSavePic, result);
                    dispatch(setPopupError(true))
                }
                // if(ids != null){
                //     console.log('Default -->',ids,albumsIds)
                //     setDefaultId(ids)
                //     if(!albumsIds?.includes(ids)){
                //         setAlbumsIds([ids])
                //         console.log('Default albumsIds -->',albumsIds)
                //     }else{
                //         setAlbumsIds([])
                //         setAlbumsIds([ids])
                //         console.log('Default albumsIds2 -->',albumsIds)
                //     }
                // }
            })
           
        // })
        }else{
        setLoading(false)
        console.log('Error')

        }
        
    }


    useEffect(() => {
        if (navigation.isFocused()) {
            fetchAllAlboms()
        }
    }, [item, popupSavePic])

    function saveToAlbum() {
        if (albumsIds.length !== 0) {
            let maxImages
            let filledAlbomsArray = albumsIds.map(albomId => {
                let selectedAlbom = albums.find(albom => albom.id === albomId)

                const photosInAlbum = countPhotosInAlbum(selectedAlbom, user.userId)

                selectedAlbom = {
                    ...selectedAlbom,
                    photosInAlbum
                }

                setLoading(true)
                maxImages = selectedAlbom.max_images
                if (selectedAlbom.photosInAlbum >= parseInt(selectedAlbom.max_images)) {
                    return selectedAlbom
                }

                return null
            })

            filledAlbomsArray = filledAlbomsArray.filter(albom => albom !== null)
            if (filledAlbomsArray.length !== 0) {
                console.log("filled --->");
                if (filledAlbomsArray[0].picures.length < 240) {
                    navigation.navigate('WeHaveNewAlbum', {
                        item: { ...filledAlbomsArray[0] }, photoFromGallery, addToAlbum: photoFromGallery ? addIntoAlbumPhotoFromGallery : addIntoAlbumPhotoFromCamera
                    })
                    dispatch(setPopupSavePic(false))
                    setLoading(false)
                }
            } else {
                if (photoFromGallery) {
                    addIntoAlbumPhotoFromGallery()
                } else {
                    addIntoAlbumPhotoFromCamera()
                }
            }
        }
        setAlbumsIds([])
    }

    async function addIntoAlbumPhotoFromGallery() {
        console.log("Adding Into Album ------>");
        let sharedAlbumIOdIndexInAlbumsIdsArr = null

        sharedAlbumIOdIndexInAlbumsIdsArr = albumsIds.findIndex(albumId => navigation.state.params.albumId === albumId)

        if (sharedAlbumIOdIndexInAlbumsIdsArr >= 0) {
            albumsIds.splice(sharedAlbumIOdIndexInAlbumsIdsArr, 1)
        }
        const formdataForApprovePhoto = new FormData
        formdataForApprovePhoto.append('token', user.token)
        formdataForApprovePhoto.append('picture_id', item.photo_id)

        await setApprovePhoto(formdataForApprovePhoto)
            .then(response => {
                console.log(response, 'setApprovePhoto response');
            }).catch(e => console.log(e))

        const photo = {
            name: "1.jpg",
            type: "image/jpg",
            uri: item.photo
        }
        let isRequestFullfilled
        const formData = new FormData()
        formData.append('token', user.token)
        formData.append('album_id', albumsIds.toString())
        formData.append('images[]', photo)

        await saveImg(formData).then(res => {
            console.log(res, 'savepic res');
            if (res != 0) {
                isRequestFullfilled = true
                if (picturesLength === 1) {
                    if (sharedAlbumIOdIndexInAlbumsIdsArr < 0) {
                        deletePicture()
                    }
                } else {
                    if (sharedAlbumIOdIndexInAlbumsIdsArr < 0) {
                        deletePicture()
                    }
                }
                getAllSharedImages(user.token).then(res => dispatch(setSharedPhotos(res.data)))
                sendData(item)
                // setLoading(false)
            } else {
                isRequestFullfilled = false
                // setLoading(false)
                dispatch(setPopupError(true))
            }
            setLoading(false)
            dispatch(setPopupSavePic(false))
        }).catch(e => console.log(e))



        if (navigation.state.params.shouldNavigateToCameraScreen && isRequestFullfilled) {
            navigation.navigate('Camera')
        }
    }

    async function addIntoAlbumPhotoFromCamera() {
        setLoading(true)
        const formData = new FormData()
        formData.append('token', user.token)
        formData.append('album_id', albumsIds.toString())
        formData.append('images[]', item)
        console.log('Image --> ', item)
        console.log("frozm Data -->", JSON.stringify(formData))
        await AsyncStorage.setItem('default_album_id', albumsIds[0])

        saveImgData(formData).then(res => {
            console.log(res, 'res saving photon');
            if (res != 0) {
                sendData(item)

                fetchAlbums(user.token).then(res => {
                    setAlbums(res.data)
                })
                deletePicture()
                console.log('checking')
            } else {
                dispatch(setPopupError(true))
            }

            setLoading(false)
            dispatch(setPopupSavePic(false))
        })
    }

    function callbackFunction(childData) {
        console.log('another call back function', childData,albumsIds)
        if(childData == defaultId){
            setDefaultId(0)
        }
        if (albumsIds?.includes(childData)) {
            console.log('Exists -->', albumsIds)
            let newList = albumsIds.filter(val => val != childData)
            setAlbumsIds(newList)
            console.log("new List",newList)
        }
        else {
            let newAlbum = albumsIds
            newAlbum.push(childData)
            setAlbumsIds(newAlbum)
            console.log("Ablum ids -->", newAlbum)
        }
    }

    const sendData = (res) => {
        props.parentCallback(res)
    }

    function isChosen(item){
        return albumsIds?.includes(item.id)
    }

    return (
        <Modal propagateSwipe animationOutTiming={500} onBackdropPress={() => dispatch(setPopupSavePic(false))} animationInTiming={500} backdropColor={'black'} isVisible={popupSavePic}>
            <View style={styles.modal}>

                <AnimatedLoader
                    visible={loading}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../../../assets/picitLoader.json")}
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1}
                ><Text>{"תמונה בשמירה..."}</Text></AnimatedLoader>
                <TouchableOpacity onPress={() => { dispatch(setPopupSavePic(false)) }} style={{ position: 'absolute', bottom: height * 0.55, alignSelf: 'flex-end' }} >
                    <Image source={require('../../../assets/images/buttonsNavBar.png')} />
                </TouchableOpacity>
                <View style={[styles.container, { height: bigger ? height * 0.85 : height * 0.55, }]}>
                    <View style={{ width: '88%', alignSelf: 'center', top: 20 }}>
                        <TouchableOpacity onPress={() => setBigger(!bigger)} style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 5 }}>
                            <Text style={{ fontSize: 20, fontFamily: 'Arimo-Bold' }}>{'שמירה לאלבום'}</Text>

                            <TouchableOpacity onPress={() => { props.navigation.navigate('CreateAlbum', { item, deleteChosenPhoto: deletePicture, chosenPic, photoFromGallery, returnToGallery: true }); dispatch(setPopupSavePic(false)) }} style={{
                                backgroundColor: colors.register,
                                height: 45,
                                width: 135,
                                borderRadius: 18,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                                margin: 5
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: colors.white, fontSize: 12, fontFamily: 'Arimo-Bold', paddingRight: 2 }}>{'הוספת אלבום‎'}</Text>
                                    <Image style={{ width: 17.6, height: 17.6 }} source={require('../../../assets/images/iconsCirclePlusWhite.png')} />
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <MaskedView
                            maskElement={<View style={{ backgroundColor: 'transparent', flex: 1, }}>
                                <LinearGradient colors={['#FFFFFF', '#FFFFFF', '#FFFFFF00']} style={styles.linearGradient}>
                                </LinearGradient>
                            </View>}
                        >
                            <VerticalSpace height={0.01} />
                            <View style={styles.line} />

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={albums}
                                extraData={data}
                                style={{ height: bigger ? height * 0.7 : height * 0.4, }}
                                contentContainerStyle={{ paddingBottom: 70 }}
                                renderItem={({ item ,index }) => {
                                    if (item.picures.length != 240 && item.status != 3)
                                        return (
                                            <View>
                                                <RadioButton
                                                    parentCallback={callbackFunction}
                                                    item={item}
                                                    userId={user.userId}
                                                    chosenValue={isChosen}
                                                    selected={index == 0 ? true : false}
                                                    photoFromGallery={defaultId == 0 ? photoFromGallery ? true : false:true}
                                                />
                                                <VerticalSpace height={0.015} />
                                            </View>
                                        )
                                }}
                            />
                        </MaskedView>
                    </View>
                    <TouchableOpacity onPress={() => { saveToAlbum() }} style={{
                        backgroundColor: colors.nextButton,
                        height: 64,
                        width: 196,
                        borderRadius: 26,
                        justifyContent: 'center',
                        alignSelf: 'flex-start',
                        alignItems: 'center',
                        left: 20,
                        bottom: 20,
                        position: 'absolute'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: colors.black, fontSize: 17, fontFamily: 'Arimo-Bold', paddingRight: 2 }}>{'שמירה'}</Text>
                            <Image source={require('../../../assets/images/iconsCircleCheck.png')} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        borderTopLeftRadius: 50,
        width: width,
        backgroundColor: colors.white,
        alignSelf: 'center',
        overflow: 'hidden',
        top: height * 0.026
    },
    cardText: {
        textAlign: 'right'
    },
    modal: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    line: {
        alignSelf: 'center',
        borderWidth: 0.5,
        width: width * 0.85,
        borderColor: 'rgba(223,225,240,0.5)',
    },
    linearGradient: {
        flex: 1,
        width: '100%',
        borderRadius: 5
    }
});
