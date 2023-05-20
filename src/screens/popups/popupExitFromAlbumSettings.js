import React from "react";
import { StyleSheet, Dimensions, Text, View } from "react-native";
import Modal from 'react-native-modal';
import Button from "../../utilities/button"
import { useSelector, useDispatch } from "react-redux";
import { colors } from "../../colors";
import { setPopupExitFromAlbumSettings } from "../../redux";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PopupExitFromAlbumSettings({ navigation, popupExitFromAlbumSettings }) {
    const dispatch = useDispatch()

    return <>
        <Modal
            animationOutTiming={300}
            animationInTiming={300}
            backdropColor={'rgba(159,156,165,1)'}
            style={{ height: height }}
            isVisible={popupExitFromAlbumSettings}
        >
            <View style={styles.absolute}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.container}>
                        <Text style={styles.headerTitle}>{'שימו לב'}</Text>
                        <Text style={styles.headerText}>{'יציאה מהגדרות האלבום תבטל את כל '}</Text>
                        <Text style={styles.headerText}>{'השינויים שנעשו באלבום'}</Text>
                        <Button text={"יציאה וביטול שינויים"} buttonStyles={styles.button} onPress={() => {
                            navigation.goBack()
                            dispatch(setPopupExitFromAlbumSettings(false))
                        }} />
                        <Button
                            text={"המשך בהגדרת האלבום"}
                            buttonStyles={styles.canselButton}
                            onPress={() => { dispatch(setPopupExitFromAlbumSettings(false)) }}
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
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
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