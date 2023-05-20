import React, { useState } from "react";
import { StyleSheet, Dimensions, Text, View } from "react-native";
import Modal from 'react-native-modal';
import Button from "../../utilities/button"
import { useSelector, useDispatch } from "react-redux";
import { colors } from "../../colors";
import { setPopupError, setPopupExitFromAlbumPreview } from "../../redux";
import { updatePictureData } from "../../api";
import { clearEditPhotosState } from "../../redux/editAlbum/editAlbumActions";
import AnimatedLoader from 'react-native-animated-loader';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PopupExitFromAlbumPreview(props) {
    const dispatch = useDispatch()
    const { user, popupExitFromAlbumPreview } = useSelector(state => state.user)
    const { deletePhotosIds, updatePhotosids, newImages } = useSelector(state => state.editAlbum)
    const { navigation, oldAlbumName, newAlbumName, albumId } = props
    const [loading, setLoading] = useState(false)

    const updateAlbumApi = async () => {
        if (deletePhotosIds.length > 0 || updatePhotosids.length > 0 || newAlbumName !== oldAlbumName) {
            setLoading(true)
            const formdata = new FormData

            formdata.append('token', user.token)
            formdata.append('album_id', albumId)
            formdata.append('deleted_picture_ids', deletePhotosIds.join(','))
            formdata.append('updated_picture_ids', updatePhotosids.join(','))
            formdata.append('album_name', newAlbumName)
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
                        navigation.navigate('MyAlbums')
                    } else {
                        dispatch(setPopupError(true))
                    }
                })

        } else {
            navigation.goBack()
        }
        dispatch(setPopupExitFromAlbumPreview(false))
    }

    return <>
        <Modal
            animationOutTiming={300}
            animationInTiming={300}
            backdropColor={'rgba(159,156,165,1)'}
            style={{ height: height }}
            isVisible={popupExitFromAlbumPreview}
        >
            <AnimatedLoader //++
                visible={loading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../../assets/picitLoader.json")}
                animationStyle={{ width: 100, height: 100 }}
                speed={1}
            ></AnimatedLoader>
            <View style={styles.absolute}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.container}>
                        <Text style={styles.headerTitle}>{'לצאת מעריכת האלבום? '}</Text>
                        <Text style={styles.headerText}>{'אל תדאגו, שמרנו את כל השינויים שעשיתם עד עכשיו 😄'}</Text>

                        <Button text="יציאה" buttonStyles={styles.button} onPress={() => {
                            updateAlbumApi()
                        }} />

                        <Button
                            text="המשך עריכת אלבום"
                            buttonStyles={styles.canselButton}
                            onPress={() => { dispatch(setPopupExitFromAlbumPreview(false)) }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    </>
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
    canselButton: {
        height: 40,
        width: 265,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
        color: colors.gray,
    },
    container: {
        height: 315,
        width: 315,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 50,
        padding: 20,
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
})