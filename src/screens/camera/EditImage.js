
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../colors';
import ImagePicker from 'react-native-image-crop-picker'

import Button from '../../utilities/button'
import Carousel from 'react-native-snap-carousel';

import { useSelector, useDispatch } from 'react-redux'
import { setPics, setSharedPhotos } from '../../redux'
import CameraRoll from "@react-native-community/cameraroll"
import { getAllSharedImages, updateAlbumImageApi } from '../../api';
import { _setPics } from '../../helpers/albumHelper';
import AnimatedLoader from 'react-native-animated-loader';
import { isIphoneX } from 'react-native-iphone-x-helper';

import {
    AdenCompat,
    _1977Compat,
    BrannanCompat,
    BrooklynCompat,
    ClarendonCompat,
    EarlybirdCompat,
    GinghamCompat,
    HudsonCompat,
    InkwellCompat,
    KelvinCompat,
} from 'react-native-image-filter-kit';
import { setNewUpdatedPhotoId, addNewImage, editAlbumPictures } from '../../redux/editAlbum/editAlbumActions';

const FILTERS = [
    {
        title: 'Normal',
        filterComponent: AdenCompat,
    },
    {
        title: 'Brooklyn',
        filterComponent: BrooklynCompat,
    },
    {
        title: 'Earlybird',
        filterComponent: EarlybirdCompat,
    },
    {
        title: 'Clarendon',
        filterComponent: ClarendonCompat,
    },
    {
        title: 'Gingham',
        filterComponent: GinghamCompat,
    },
    {
        title: 'Hudson',
        filterComponent: HudsonCompat,
    },
    {
        title: 'Inkwell',
        filterComponent: InkwellCompat,
    },
    {
        title: 'Kelvin',
        filterComponent: KelvinCompat,
    },
    {
        title: 'Aden',
        filterComponent: AdenCompat,
    },
    {
        title: '_1977',
        filterComponent: _1977Compat,
    },
    {
        title: 'Brannan',
        filterComponent: BrannanCompat,
    },
];

const { width, height } = Dimensions.get('window');

export default function editImage({ navigation }) {
    const [uri, setUri] = useState(navigation.state.params.chosenPicUri)
    const { user, pictures, pictureToDelete, allSharedPictures } = useSelector(state => state.user)
    const { editedAlbumImages } = useSelector(state => state.editAlbum)
    const [screen, setScreen] = useState('1'); // 1 my pictures, 2 shared with me
    const [configuredPhoto, setConfiguredPhoto] = useState(uri)
    const [imageSize, setImageSize] = useState({ width: null, height: null })
    const [loading, setLoading] = useState(false)
    // console.log("Uri ------>", navigation.state);
    const getAlbum = navigation.state.params.getAlbum
    let uploadPhotoMarker = navigation.state.params.uploadPhoto
    let id = navigation.state.params.image?.id
    const [LoadingFilter, setLoadingFilter] = useState(false)
    const dispatch = useDispatch()
    const CarouselRef = useRef(null)
    const [selectedFilterIndex, setIndex] = useState(0);

    useEffect(() => {
        if (uri !== null) {
            Image.getSize(uri, (imgWidth, imgHeight) => {
                let res = {}
                if (imgWidth > imgHeight) {
                    res = {
                        width: width * 0.95,
                        height: Math.floor(imgHeight * ((width * 0.95) / imgWidth))
                    }
                } else if (imgHeight > imgWidth) {
                    res = {
                        height: height * 0.58,
                        width: Math.floor(imgWidth * ((height * 0.58) / imgHeight))
                    }
                } else {
                    res = {
                        width: width * 0.95,
                        height: height * 0.58
                    }
                }
                setImageSize({ ...res })
            })
        }
    }, [uri])

    const editPageInAlbum = (editPic) => {
        if (uploadPhotoMarker === 'yes') {
            const pic = {
                uri: editPic,
                type: 'image/jpg',
                name: pictures.length + 1 + '.jpg'
            }
            console.log(pic, 'pic ------------>');
            let indexs = {
                arrIndex: null,
                photoIndex: null
            }

            const erditedImages = [...editedAlbumImages]
            // console.log("before ---->", erditedImages);

            erditedImages.map((images, index) => {
                const imgIndex = images.findIndex(i => i.id == id)
                // console.log("Image index--->", imgIndex, pic.uri);
                if (imgIndex >= 0) {
                    indexs.arrIndex = index
                    indexs.photoIndex = imgIndex
                    erditedImages[index][imgIndex].picture = pic.uri

                }
            })

            // console.log("after ----> ", erditedImages);

            dispatch(editAlbumPictures(erditedImages))
            dispatch(setNewUpdatedPhotoId(id))
            dispatch(addNewImage(pic))
            setLoading(false)

            // navigation.goBack();

        }
    }

    const uploadPhotoToAlbum = () => {
        if (uploadPhotoMarker === 'yes') {
            const pic = {
                uri: configuredPhoto,
                type: 'image/jpg',
                name: pictures.length + 1 + '.jpg'
            }

            const formData = new FormData();
            formData.append('token', user.token)
            formData.append('picture_id', id)
            formData.append('image', pic)

            updateAlbumImageApi(formData).then(res => {
                getAlbum();
            });
        } else {
            console.log('return')
        }
    }

    const onSelectFilter = selectedIndex => {
        setIndex(selectedIndex);
    }

    const saveEditedImage = async () => {
        const pic = {
            uri: configuredPhoto,
            type: 'image/jpg',
            name: pictures.length + 1 + '.jpg'
        }

        CameraRoll.save(pic.uri).catch((error) => {
            console.log("error:", error);
        })
        // delete original picture without filter or cropp
        if (pictureToDelete) {
            if (navigation.state.params.photoFromCamera) {
                let array = pictures
                const index = array.findIndex(picture => picture.uri === pictureToDelete)
                array = array.filter(picture => picture.uri !== pictureToDelete)
                array.splice(index, 0, pic)
                _setPics(array);
                dispatch(setPics([...array]))
                navigation.navigate('ChooseImages', { pictures, chosenPictureStartScreen: '1', imgSize: { ...imageSize } })
            } else {
                const pic = {
                    uri: configuredPhoto,
                    type: 'image/jpg',
                    name: '1.jpg'
                }
                const formData = new FormData();
                formData.append('token', user.token)
                formData.append('picture_id', pictureToDelete.photo_id)
                formData.append('image', pic)
                console.log("formData --->", formData);
                setLoading(true)
                await updateAlbumImageApi(formData).then(res => {
                    getAllSharedImages(user.token).then(res => {
                        dispatch(setSharedPhotos(res.data))
                    })
                }).then(() => {
                    setLoading(false)
                    navigation.navigate('ChooseImages', { pictures: allSharedPictures, chosenPictureStartScreen: '2', imgSize: { ...imageSize } })
                })
            }
        }
    }

    const renderFilterComponent = ({ item, index }) => {
        const FilterComponent = item.filterComponent;
        const image = (
            <Image
                style={{
                    borderRadius: 10,
                    height: 55,
                    width: 55
                }}
                source={{ uri: uri }}
            />
        )

        return (
            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                <TouchableOpacity
                    style={styles.images}
                    onPress={() => {
                        onSelectFilter(index);
                        CarouselRef.current.snapToItem(index, true)
                    }}>
                    <FilterComponent image={image} />
                </TouchableOpacity>
                <Text style={styles.filterTitle}>{item.title}</Text>
            </View>

        );
    };
    const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;

    const buttonStyles = {
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 40,
        fontSize: 15,
        width: 78,
        bottom: 10,
        borderRadius: 26,
        justifyContent: 'center',
        fontFamily: 'Arimo-Regular',
    }

    return (
        <View style={styles.container}>
            {/* <ActivityIndicator visible={true} /> */}
            <AnimatedLoader
                visible={loading || LoadingFilter}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../../assets/picitLoader.json")}
                animationStyle={{ width: 100, height: 100 }}
                speed={1}
            >{loading && <Text>{"תמונה בשמירה..."}</Text>}</AnimatedLoader>
            <View style={{ width: '95%', alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: isIphoneX() ? 50 : 20 }}>

                    {console.log(navigation.state.params)}
                    <Button text="שמירה" buttonStyles={buttonStyles} onPress={() => {
                        if (navigation.state.params?.isImageInAlbumPreview) {
                            setLoading(true)
                            if (selectedFilterIndex == 0) {
                                editPageInAlbum(configuredPhoto)
                                navigation.goBack();
                            }

                            else {
                                setTimeout(() => {
                                    setLoading(false)
                                    console.log("here");
                                    navigation.setParams({ currentImage: id })
                                    navigation.goBack()
                                }, 3000)
                            }

                        } else {
                            console.log("here");
                            saveEditedImage();
                            uploadPhotoToAlbum();
                        }
                    }} />
                    <Text style={[styles.cardText, { right: 15 }]}>{'עריכת תמונה'}</Text>
                    <TouchableOpacity style={{ zIndex: 1 }} onPress={() => {
                        editPageInAlbum(uri)
                        navigation.goBack()
                    }}>
                        <Image source={require('../../../assets/images/buttonsNavBarButtonsCircleButtonBlackAlpha.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.cameraContainer}>
                    {
                        uri ?
                            <View style={{
                                borderRadius: 20,
                                overflow: 'hidden',
                                width: imageSize?.width,
                                height: imageSize?.height
                            }}
                            >
                                {selectedFilterIndex === 0 ? (
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        source={{ uri: uri }}
                                    />
                                ) : (
                                    <SelectedFilterComponent
                                        onExtractImage={({ nativeEvent }) => {
                                            console.log("Native -->", nativeEvent);
                                            editPageInAlbum(nativeEvent.uri)
                                            setConfiguredPhoto(nativeEvent.uri);
                                        }}
                                        extractImageEnabled={true}
                                        image={
                                            <Image style={{
                                                borderRadius: 10,
                                                width: '100%',
                                                height: imageSize?.height,
                                            }}
                                                source={{ uri: uri }}
                                            />
                                        }
                                    />
                                )}

                            </View>
                            : null
                    }

                </View>
                <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.white, alignSelf: 'center', top: height * 0.055 }} />
                <Carousel
                    keyExtractor={item => item.title}
                    horizontal={true}
                    renderItem={renderFilterComponent}
                    containerCustomStyle={{ alignSelf: 'center', marginTop: height * 0.062 }}
                    ref={CarouselRef}
                    data={FILTERS}
                    inactiveSlideScale={1}
                    onBeforeSnapToItem={(activeIndex) => {
                        onSelectFilter(activeIndex)
                    }}
                    ListEmptyComponent={() => { return (<View style={{ height: 80 }} />) }}
                    sliderWidth={width}
                    itemWidth={75}
                />
                {console.log(imageSize)}

                <View style={{ flexDirection: 'row-reverse', marginTop: height * 0.025, justifyContent: 'space-evenly', width: 120, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => setScreen('1')} style={{ justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 20, backgroundColor: screen == '1' ? colors.chosenEdit : colors.black }}>
                        <Image source={require('../../../assets/images/iconsCameraFilterActive.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setIndex(0);
                        ImagePicker.openCropper({
                            freeStyleCropEnabled: true,
                            writeTempFile: true,
                            // width: 1020,
                            // height: 1920,
                            path: configuredPhoto,
                            cropping: false,
                            hideBottomControls: true,
                            enableRotationGesture: true,
                            cropperToolbarTitle: 'חיתוך תמונה',
                        }).then(image => {
                            setUri(image.path)
                            setConfiguredPhoto(image.path)
                        }).catch((err)=> console.log("close"))
                    }} style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 20,
                        backgroundColor: screen == '2' ? colors.crop : colors.black
                    }}>
                        <Image source={require('../../../assets/images/iconsCameraFilter.png')} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    cameraContainer: {
        borderRadius: 26,
        width: '100%',
        top: height * 0.06,
        height: height * 0.6,
        alignSelf: 'center',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        height: height * 0.6,
    },
    images: {
        borderRadius: 15,
        height: 65,
        width: 65,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    cardText: {
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
        textAlign: 'center',
        color: colors.white
    },
    edit: {
        width: 73,
        position: 'absolute',
        height: 40,
        backgroundColor: colors.edit,
        zIndex: 10,
        left: 10,
        borderColor: colors.white,
        borderWidth: 0.3,
        justifyContent: 'center',
        borderRadius: 18,
        top: 10
    },
    image: {
        width: 520,
        height: 520,
        alignSelf: 'center',
    },
    filterSelector: {
        width: 100,
        height: 100,
    },
    filterTitle: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Arimo-Regular',
        color: colors.white
    },
    textWrapper: {
        width: width,
        height: 150,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        color: colors.white,
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 5,
    },
    text: {
        color: colors.white,
        fontSize: 13,
    },
});