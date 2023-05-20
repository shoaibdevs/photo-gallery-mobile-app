import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import Modal from 'react-native-modal'
import Button from "../../utilities/button"
import { colors } from "../../colors";
import { useDispatch, useSelector } from "react-redux";
import { setPopupDeleteAlbum, setPopupAlbum, setCountReadyForOrderAlbums, setPopupAlbumInProgress, setPopupError } from "../../redux";
import { deleteAlbumAPI } from '../../api'
import { deleteAlbumData } from '../../helpers/albumHelper';
import AnimatedLoader from "react-native-animated-loader"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PopupDeleteAlbum(props) {
    const dispatch = useDispatch()
    const { item, popupDeleteAlbum } = props
    const { user, countReadyForOrderAlbums } = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)

    const deleteAlbum = async () => {
    //     const formData = new FormData()
    //     formData.append('token', user.token)
    //     formData.append('album_id', item.id)

        setLoading(true)
        var res = await deleteAlbumData(item.id);
            console.log(res, 'responseresponseresponse');
            if (res != 0) {
                if (res.success) {
                    if (item.status == 1) {
                        const newCount = countReadyForOrderAlbums - 1
                        dispatch(setCountReadyForOrderAlbums(newCount))
                        props.setAlbumsReady(prev => prev.filter(album => album.id != item.id))
                        // console.log('status 1')
                    } else if (item.status == 2) {
                        props.setAlbumsInProgress(prev => prev.filter(album => album.id != item.id))
                        // console.log('status 2')
                    } else {
                        props.setAlbumsFinished(prev => prev.filter(album => album.id != item.id))
                    }
                } else {
                    console.log('delete album response err', res)
                }
            } else {
                dispatch(setPopupError(true))
            }
            setLoading(false)
            dispatch(setPopupDeleteAlbum(false))
            dispatch(setPopupAlbumInProgress(false));
            dispatch(setPopupAlbum(false))
    }

    return (
        <>
            {Object.keys(item).length > 0 && popupDeleteAlbum ? (
                <Modal
                    animationOutTiming={300}
                    animationInTiming={300}
                    backdropColor={'rgba(159,156,165,1)'}
                    style={{ height: height }}
                    isVisible={popupDeleteAlbum}
                >
                    <AnimatedLoader
                        visible={loading} // was false on developer branch
                        overlayColor="rgba(255,255,255,0.75)"
                        source={require("../../../assets/picitLoader.json")}
                        animationStyle={{ width: 100, height: 100 }}
                        speed={1}
                    ></AnimatedLoader>
                    <View style={styles.absolute}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.container}>
                                <View style={styles.imageBlock}>
                                    <Image source={require('../../../assets/images/componentsDialogAlertBoxsCoverPhotosImgDialogCoverError.png')} />
                                </View>
                                <View style={{ padding: 30, justifyContent: "center", alignItems: "center", marginTop: 180 }}>
                                    <Text style={styles.headerTitle}>{'מחיקת אלבום'}</Text>
                                    <Text style={styles.headerText}>{' בטוחים שאין פה זיכרונות ששווה לשמור?'}</Text>
                                    <Text style={styles.headerText}>{'שימו לב, לאחר מחיקה לא יהיה ניתן לשחזר את האלבום'}</Text>


                                    <Button text="מחיקה" buttonStyles={styles.button} onPress={() => {
                                        deleteAlbum()
                                    }} />

                                    <Button
                                        text="ביטול"
                                        buttonStyles={{
                                            height: 30,
                                            width: 100,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: 10,
                                            fontFamily: 'Arimo-Regular',
                                            fontSize: 17,
                                            color: colors.gray
                                        }}
                                        onPress={() => { dispatch(setPopupDeleteAlbum(false)) }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>) : null}
        </>
    )
}

const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: -20,
        left: -20,
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(215,215,215,.3)',
    },
    button: {
        height: 64,
        width: 265,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        marginTop: 10,
        fontSize: 17,
        color: colors.errorColor,
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.errorLight
    },
    container: {
        height: 512,
        width: 315,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 50,
        // padding: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Arimo-Bold',
        color: colors.primary,
        textAlign: "center"
    },
    headerText: {
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: colors.primary,
        textAlign: 'center',
        marginTop: 10,
    },
    imageBlock: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 0
    }
})