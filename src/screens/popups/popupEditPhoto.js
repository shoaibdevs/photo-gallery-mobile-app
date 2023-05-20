import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../colors'
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux'
import { setPopupEditPhoto } from '../../redux'
import { VerticalSpace } from '../../utilities/verticalSpace'
import { editAlbumPictures, setNewPhotoToDelete } from '../../redux/editAlbum/editAlbumActions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function popupEditPhoto({ editImage, navigation, getAlbum, lastPhoto, setLastPhoto, handlePhotoChange, albumLength, setMaxDeletePopup, item }) {
    console.log("Photos --------->", albumLength);
    const dispatch = useDispatch()
    const { popupEditPhoto } = useSelector(state => state.user)
    const { editedAlbumImages } = useSelector(state => state.editAlbum)
    // console.log("editedAlbumImages", editedAlbumImages);
    const addDeleteIcon = () => {
        setTimeout(() => {
            setLastPhoto(false)
        }, 1000)
    }

    const deletePhotoFromAlbum = () => {
        if (albumLength == 40) {
            console.log("here");
            dispatch(setPopupEditPhoto(false))
            setTimeout(() => {
                setMaxDeletePopup()

            }, 1000)
        }
        else {
            dispatch(setPopupEditPhoto(false))

            let photosArr = [...editedAlbumImages]
            photosArr = photosArr.reduce((res, photos) => {
                const filteredPhotos = photos.filter(p => p.id != editImage.id)

                if (res.length == 0) {
                    if (filteredPhotos.length == 0) {
                        return [null]
                    }

                    return [filteredPhotos]
                }

                if (filteredPhotos.length == 0) {
                    return [...res, null]
                }

                return [...res, filteredPhotos]
            }, [])
            photosArr = photosArr.filter(p => p != null)
            dispatch(editAlbumPictures(photosArr))
            dispatch(setNewPhotoToDelete(editImage.id))
            handlePhotoChange()
        }
    }

    return (
        <View>
            <Modal animationOutTiming={500} animationInTiming={500} backdropColor={'rgb(220,219,223)'} onBackdropPress={() => dispatch(setPopupEditPhoto(false))} isVisible={popupEditPhoto}>
                <View style={styles.modal}>
                    <View style={styles.container}>

                        <View style={{ width: '85%', alignSelf: 'center', top: 20 }}>
                            <View style={{ alignItems: 'flex-end', flexDirection: 'row-reverse' }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'Arimo-Bold', padding: 10, paddingTop: 15, paddingBottom: 30 }}>{'אפשרויות תמונה'}</Text>

                                    <View style={{ justifyContent: 'center', alignItems: 'flex-end', left: 10 }}>

                                    </View>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={{
                            flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 20,
                            marginRight: 30
                        }} onPress={() => {
                            navigation.navigate('EditImage', { chosenPicUri: editImage.picture, uploadPhoto: 'yes', image: editImage, getAlbum, isImageInAlbumPreview: true });
                            dispatch(setPopupEditPhoto(false))
                            navigation.setParams({ isImageInAlbumPreview: true })
                            addDeleteIcon();
                        }} >
                            <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, color: colors.gray, textAlign: 'right', right: 10 }}>{'עריכת תמונה'}</Text>
                            <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconsCameraCrop.png')} />
                        </TouchableOpacity>
                        <View style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder, marginTop: 25 }]} />
                        <VerticalSpace height={0.03} />
                        {!lastPhoto && <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 30 }}
                            onPress={() => { deletePhotoFromAlbum() }}
                        >
                            <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 17, color: colors.red, textAlign: 'right', right: 10 }}>{'הסרת תמונה מאלבום'}</Text>
                            <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconsDelete.png')} />
                        </TouchableOpacity>}
                        <View style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder, marginTop: 25 }]} />
                        <TouchableOpacity onPress={() => { dispatch(setPopupEditPhoto(false)); addDeleteIcon(); }} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginRight: 30, marginTop: 25 }} >
                            <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 17, color: colors.gray, textAlign: 'right', right: 10 }}>{'ביטול'}</Text>
                            <Image source={require('../../../assets/images/iconsCircleX.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        width: width,
        height: height * 0.40,
        backgroundColor: colors.white,
        alignSelf: 'center',
        overflow: 'hidden',
        top: height * 0.03,
    },
    cardText: {
        textAlign: 'right'
    },
    modal: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    line: {
        alignSelf: 'center',
        borderWidth: 2,
        width: width * 0.85,
        borderColor: colors.album,
        marginTop: 40,
    },
});
