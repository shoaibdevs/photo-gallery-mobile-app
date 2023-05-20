import React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { BlurView } from "@react-native-community/blur"
import Modal from 'react-native-modal'
import { colors } from "../../colors"
import { VerticalSpace } from '../../utilities/verticalSpace'
import Button from '../../utilities/button'
import { useSelector, useDispatch } from "react-redux"
import { setPopupConfirm } from "../../redux"

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const PopupConfirm = ({ navigation }) => {
    const popupConfirmState = useSelector(state => state.user.popupConfirm)
    const dispatch = useDispatch()

    const buttonStyles = {
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 64,
        width: 265,
        borderRadius: 26,
        justifyContent: 'center',
        alignSelf: 'center',
        top: 20,
        fontSize: 17,
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Modal animationOutTiming={500} animationInTiming={500} isVisible={popupConfirmState}>
                <BlurView
                    style={styles.blurView}
                    blurType="light" // Values = dark, light, xlight .
                    blurAmount={10}
                    reducedTransparencyFallbackColor="black"
                />

                <View style={styles.background}>
                    <View style={{ top: 20 }}>
                        <Text style={[styles.cardText, { fontSize: 20, fontFamily: 'Arimo-Bold' }]}>{'תודה שפניתם!'}</Text>
                        <VerticalSpace height={0.02} />
                        <Text style={[styles.cardText]}>{'קיבלנו את הפנייה ונהיה בקשר ממש'}</Text>
                        <Text style={[styles.cardText]}>{'בקרוב 😀'}</Text>
                        <Button text="חזרה למצלמה" buttonStyles={buttonStyles} onPress={() => {
                            dispatch(setPopupConfirm(false));
                            navigation.navigate('Camera');
                        }} />
                    </View>
                </View>
            </Modal>

        </View >
    )
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12
    },
    blurView: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'rgba(159,156,165,0.3)',
        flex: 1,
        width: width,
        height: height
    },
    background: {
        elevation: 3,
        borderRadius: 50,
        width: 315,
        height: 259,
        backgroundColor: colors.white,
        alignSelf: 'center',
        alignItems: 'center',
        padding: 15
    },
    cardText: {
        textAlign: 'center',
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
    },
    modal: {
        width: '100%',
        top: 20,
        justifyContent: 'center',
        flex: 1,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})

export default PopupConfirm