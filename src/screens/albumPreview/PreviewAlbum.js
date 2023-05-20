import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, ScrollView, Image, BackHandler, TouchableOpacity, Dimensions, TextInput } from 'react-native'
import { colors } from '../../colors'
import background from '../../../assets/images/coverBackgroundsiMgBackgroundCover3.png'
import backgroundFrontCover from '../../../assets/images/whiteCoverForAlbum.png'
import backgroundBackCover from '../../../assets/images/whiteBottomCover.png'
import { VerticalSpace } from '../../utilities/verticalSpace'
import PreviewAlbumPage from './PreviewAlbumPage'
import PopupEditPhoto from '../popups/popupEditPhoto'
import { useDispatch, useSelector } from 'react-redux'
import { setPopupExitFromAlbumPreview, setPopupError } from '../../redux'
import { getAlbumById, newAlbum, updateAlbumImageApi, updatePictureData } from '../../api'
import { editAlbumPictures, setAlbumPictures, clearEditPhotosState } from '../../redux/editAlbum/editAlbumActions'
import PopupExitFromAlbumPreview from '../popups/popupExitFromAlbumPreview'
import AnimatedLoader from 'react-native-animated-loader';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import PopupError from '../popups/popupError'
import PopupMaxDelete from '../popups/popupMaxDelete'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PreviewAlbum = ({ navigation }) => {
    const [item, setItem] = useState(navigation.state.params.currentAlbum)
    const { user } = useSelector(state => state.user)
    const [chosenPicToEdit, setChosenPicToEdit] = useState('')
    const [lastPhoto, setLastPhoto] = useState(false)
    const [maxDelete, setMaxDelete] = useState(false)
    const dispatch = useDispatch()
    const currentUserId = user.userId
    const { editedAlbumImages } = useSelector(state => state.editAlbum)
    const [groupedList, setGroupedList] = useState(editedAlbumImages)
    const [photosInAlbum, setPhotosInAlbum] = useState(0)
    const [newName, setNewName] = useState(navigation?.state.params.currentAlbum['albume_name'])
    const [loading, setLoading] = useState(false)
    const { deletePhotosIds, updatePhotosids, newImages } = useSelector(state => state.editAlbum)
    let albumLength = photosInAlbum;
    console.log(albumLength);



    const updateAlbumApi = async () => {
        if (deletePhotosIds.length > 0 || updatePhotosids.length > 0) {
            setLoading(true)
            const formdata = new FormData

            formdata.append('token', user.token)
            formdata.append('album_id', item.albumId)
            formdata.append('deleted_picture_ids', deletePhotosIds.join(','))
            formdata.append('updated_picture_ids', updatePhotosids.join(','))
            formdata.append('album_name', newName)
            if (newImages.length > 0) {
                await newImages.forEach(image => {
                    formdata.append('images[]', image)
                })
            } else {
                formdata.append('images[]', '')
            }
            console.log(JSON.stringify(formdata));

            await updatePictureData(formdata)
                .then(res => {
                    console.log(res, 'res update album');
                    setLoading(false)
                    if (res != 0) {
                        navigation.navigate('OrderInfo', { currentAlbum: item })
                        dispatch(clearEditPhotosState())
                    } else {
                        dispatch(setPopupError(true))
                    }
                })

        }
        else {
            navigation.navigate('OrderInfo', { currentAlbum: item })

        }
    }

    const handlePhotoChange = () => {
        albumLength = albumLength - 1
        console.log("albumLength -->", albumLength);
        setPhotosInAlbum(albumLength)


    }
    useEffect(() => {
        var c = 0;
        item.picures.forEach(row => {
            row.forEach(() => c++)
        })
        setPhotosInAlbum(c)

        console.log("Pic to Edit --->", navigation.state.params);
        if (navigation.state.params.currentImage != undefined) {
            const find = editedAlbumImages[0].filter(pic => pic.id == navigation.state.params.currentImage)
            console.log("find", find);
            const pic = {
                uri: find.picture,
                type: 'image/jpg',
                name: navigation.state.params.currentAlbum.picures.length + 1 + '.jpg'
            }
            const formData = new FormData();
            formData.append('token', user.token)
            formData.append('picture_id', navigation.state.params.currentImage)
            formData.append('image', pic)
            console.log("formData", formData);
            updateAlbumImageApi(formData).then(res => {
                console.log("Res --->", res);
            });
        }


        const photos = filterAprovedPhotos(currentUserId)
        setTimeout(() => {
            setLoading(true)
        }, 1000);
        setTimeout(() => {
            setLoading(false)
        }, 8000);
        setGroupedList(photos)
        dispatch(setAlbumPictures(photos))
        dispatch(editAlbumPictures(photos))
    }, [maxDelete])
    useEffect(() => {
        setGroupedList(editedAlbumImages)
    }, [editedAlbumImages])

    const getAlbum = () => {
        getAlbumById(user.token, item.id).then(res => {
            setGroupedList(res.data.picures);
        })
    }

    function filterAprovedPhotos(currentUserId) {
        let aprovedPictures = navigation.state.params.currentAlbum.picures.reduce((aprovedpictures, pictures) => {
            const picturesGroup = pictures.filter(p => p.isApproved == '1' && p.added_by != currentUserId)
            const picturesAddedByYourself = pictures.filter(p => p.added_by == currentUserId)

            let allPhotos = [...picturesGroup, ...picturesAddedByYourself]

            if (aprovedpictures?.length == 0) {
                if (allPhotos?.length == 0) {
                    return [null]
                }

                return [allPhotos]
            }

            if (allPhotos?.length == 0) {
                return [aprovedpictures, null]
            }

            return [...aprovedpictures, allPhotos]
        }, [])

        aprovedPictures = aprovedPictures.filter(photosArr => photosArr != null)

        return aprovedPictures
    }


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove();
    }, [])

    return (

        <View style={styles.container}>
            <AnimatedLoader //++
                visible={loading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../../assets/picitLoader.json")}
                animationStyle={{ width: 100, height: 100 }}
                speed={1}
            ></AnimatedLoader>
            <MaskedView
                maskElement={<View style={{ backgroundColor: 'transparent', flex: 1, }}>
                    <LinearGradient colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF00']} style={styles.linearGradient}>
                    </LinearGradient>
                </View>}
            >

                <ScrollView>
                    <View style={styles.titleBlock}>
                        <Text style={[styles.title]}>{'תצוגה מקדימה'}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => { dispatch(setPopupExitFromAlbumPreview(true)) }}>
                            <Image source={require('../../../assets/images/buttonsNavBar.png')} style={{ height: 40, width: 40 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.secondTitleContainer}>
                        <Text style={styles.secondTitle}>{'ברכותינו!  האלבום מוכן להדפסה!'}</Text>
                        <Text style={styles.secondTitle}>{'מוזמנים לעבור עליו פעם אחרונה, להזמין והוא'}</Text>
                        <Text style={styles.secondTitle}>{'אצלכם!'}</Text>
                    </View>

                    <ImageBackground source={background} style={{ width: '100%', height: 55, bottom: 55 }} />
                    <View style={styles.coverWrapper}>
                        <ImageBackground source={backgroundFrontCover} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                        <Image style={{ width: 65, height: 27, position: 'absolute', bottom: 25, left: 25, resizeMode: 'contain' }} source={require('../../../assets/images/logoForWhiteCover.png')} />
                        <View style={styles.frame}>

                            <TextInput
                                editable={item.isAlbumLocked == '1' ? false : true}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    paddingHorizontal: 10,
                                    height: 96,
                                    fontFamily: 'Arimo-Bold',
                                    borderRadius: 6,
                                    color: colors.black,
                                    borderWidth: 0,
                                    fontSize: 27,
                                    marginTop: newName.length > 18 ? 10 : 30
                                }}
                                textAlignVertical={'top'}
                                maxLength={36}
                                numberOfLines={2}
                                multiline={true}
                                value={newName}
                                onChangeText={txt => setNewName(txt)}
                            />
                        </View>
                    </View>

                    <View style={styles.renderCards}>
                        {groupedList.map((group, groupIndex) => {
                            return (
                                <PreviewAlbumPage
                                    pages={group[0].length == undefined ? group : group[0]}
                                    groupIndex={groupIndex}
                                    setChosenPicToEdit={setChosenPicToEdit}
                                    key={groupIndex.toString()}
                                    setLastPhoto={setLastPhoto}
                                    isAlbumLocked={item.isAlbumLocked}
                                />
                            )
                        })}
                    </View>
                    <View style={[styles.coverWrapper, { bottom: 0 }]}>
                        <ImageBackground source={backgroundBackCover} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <VerticalSpace height={0.06} />
                </ScrollView>
            </MaskedView>
            <TouchableOpacity onPress={() => { updateAlbumApi() }} style={buttonStyles}>
                <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, color: '#12022f', textAlign: 'center' }}>{'להזמנה'}</Text>
                <Image style={{ width: 25, height: 25, }} source={require('../../../assets/images/iconsCircleLeft.png')} />
            </TouchableOpacity>
            <PopupMaxDelete
                maxDelete={maxDelete}
                setMaxDelete={(value) => setMaxDelete(value)}
            />
            <PopupEditPhoto
                editImage={chosenPicToEdit}
                item={item}
                navigation={navigation}
                handlePhotoChange={handlePhotoChange}
                albumLength={photosInAlbum}
                setMaxDeletePopup={() => setMaxDelete(true)}
                getAlbum={getAlbum}
                lastPhoto={lastPhoto}
                setLastPhoto={setLastPhoto} />
            <PopupExitFromAlbumPreview
                navigation={navigation}
                oldAlbumName={navigation.state.params.currentAlbum['albume_name']}
                newAlbumName={newName}
                albumId={item.id}
            />
            <PopupError />
        </View>
    )
}



const buttonStyles = {
    backgroundColor: colors.nextButton,
    color: colors.black,
    height: 64,
    fontSize: 17,
    flexDirection: 'row',
    alignItems: 'center',
    width: 196,
    borderRadius: 26,
    fontFamily: 'Arimo-Bold',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral,
    },
    coverWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        bottom: 20,
        width: 335,
        height: 474,
        position: 'relative'
    },
    frame: {
        width: 270,
        height: 117,
        borderWidth: 1,
        borderColor: colors.gray2,
        borderStyle: 'dashed',
        borderRadius: 7,
        justifyContent: 'center',
        bottom: 86,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.05)'
    },
    text: {
        alignSelf: 'center',
        fontSize: 31,
        color: 'white',
    },
    title: {
        fontSize: 17,
        color: colors.primary,
        alignSelf: 'center',
        top: 70,
        fontFamily: 'Arimo-Regular'
    },
    secondTitleContainer: {
        top: 20,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    secondTitle: {
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: colors.gray,
    },
    renderCards: {
        marginLeft: 20,
        marginRight: 20,
    },
    buttonBlock: {
        flexDirection: 'row',
        paddingTop: 20
    },
    linearGradient: {
        flex: 1,
        width: '100%',
        borderRadius: 5
    },
    returnButton: {
        height: 50,
        width: 50,
        backgroundColor: 'rgba(64,64,64,0.5)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        top: 5,
        marginLeft: 50
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginRight: 25,
        height: 40,
        width: 40,
    },
    titleBlock: {
        alignItems: 'flex-end'
    }
})

export default PreviewAlbum;