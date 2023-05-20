import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import { colors } from "../../colors";
import { setPopupWarningFullAlbum } from "../../redux";
import Button from "../../utilities/button"
import { useDispatch } from 'react-redux'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

function PopupWarningFullAlbum(props) {
    const dispatch = useDispatch()
    const { navigation, popupWarningFullAlbum, currentAlbum } = props

    return <Modal animationOutTiming={300} animationInTiming={300} backdropColor={'rgba(159,156,165,0.4)'} style={{ height: height }} isVisible={popupWarningFullAlbum}>
        <View style={styles.absolute}>
            <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <View style={styles.container}>
                    <Text style={styles.headerTitle}>{'שימו לב'}</Text>
                    <Text style={styles.headerText}>{'האלבום יהיה זמין ל-30 יום בלבד ולאחר מכן יינעל.'}</Text>
                    <Text style={styles.headerText}>{'להזמנת אלבום יש להיכנס לתפריט הצד ולבחור ב"אלבומים שלי”.'}</Text>
                    <Button text="חזרה למצלמה" buttonStyles={styles.button} onPress={() => {
                        dispatch(setPopupWarningFullAlbum(false))
                        navigation.navigate('Camera')
                    }} />
                    <Button
                        text="תצוגה מקדימה והזמנת אלבום"
                        buttonStyles={{ height: 30, width: 230, alignItems: 'center', justifyContent: 'center', marginTop: 10, fontSize: 17, color: colors.gray }}
                        onPress={() => { dispatch(setPopupWarningFullAlbum(false)); navigation.navigate('PreviewAlbum', { currentAlbum }) }} />
                </View>
            </View>
        </View>
    </Modal>
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
        height: 308,
        width: 315,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 50,
        paddingHorizontal: 27
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Arimo-Bold',
        color: colors.primary,
    },
    headerText: {
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: colors.primary,
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 10,
    }
})

export default PopupWarningFullAlbum