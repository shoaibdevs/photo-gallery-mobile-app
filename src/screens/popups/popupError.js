import React from "react";
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import Modal from 'react-native-modal'
import Button from "../../utilities/button"
import { colors } from "../../colors";
import { useDispatch, useSelector } from "react-redux";
import { setPopupError } from "../../redux";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PopupError() {
    const dispatch = useDispatch()
    const { popupError } = useSelector(state => state.user)

    return (
        <>
            <Modal
                animationOutTiming={300}
                animationInTiming={300}
                backdropColor={'rgba(159,156,165,1)'}
                style={{ height: height }}
                isVisible={popupError}
            >
                <View style={styles.absolute}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.container}>
                            <View style={styles.imageBlock}>
                                <Image source={require('../../../assets/images/componentsDialogAlertBoxsCoverPhotosImgDialogCoverError.png')} />
                            </View>
                            <View style={{ padding: 30, justifyContent: "center", alignItems: "center", marginTop: 180 }}>
                                <Text style={styles.headerTitle}>{'אופס'}</Text>
                                <Text style={styles.headerText}>{'אין תקשורת סלולרית. אתם עדיין יכולים לצלם ולשמור לאלבומים'}</Text>

                                <Button text="אישור" buttonStyles={styles.button} onPress={() => {
                                    dispatch(setPopupError(false))
                                }} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
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
        color: colors.black,
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.nextButton
    },
    container: {
        height: 390,
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